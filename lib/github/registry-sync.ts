import { getSupabaseAdmin } from "@/lib/supabase/admin";

const GITHUB_API_URL = "https://api.github.com";
const DEFAULT_SYNC_INTERVAL_DAYS = 5;
const DEFAULT_MAX_ITEMS = 600;
const DEFAULT_CONCURRENCY = 8;
const SCHEDULE_GRACE_MINUTES = 30;

type RegistryType = "mcp" | "skill";
type RegistryTable = "mcp_packages" | "skills";

interface RegistryItem {
  id: string;
  name: string;
  description: string | null;
  github_repo_url: string;
  github_updated_at: string | null;
  last_synced_at: string | null;
  readme_content: string | null;
  type: RegistryType;
  table: RegistryTable;
}

interface GitHubRepository {
  default_branch: string;
  description: string | null;
  forks_count: number;
  full_name: string;
  pushed_at: string | null;
  stargazers_count: number;
  updated_at: string;
}

interface GitHubSource {
  kind: "repository" | "directory" | "file";
  path: string | null;
  repository: string;
}

interface ResolvedRegistryItem {
  item: RegistryItem;
  source: GitHubSource;
}

interface SyncFailure {
  repository: string;
  message: string;
}

export interface RegistrySyncResult {
  due: number;
  failed: number;
  failures: SyncFailure[];
  forced: boolean;
  intervalDays: number;
  repositories: number;
  skipped: number;
  succeeded: number;
}

function readBoundedInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number
): number {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function parseGitHubSource(repoUrl: string): GitHubSource | null {
  const sshMatch = repoUrl.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/i);
  if (sshMatch) {
    return {
      kind: "repository",
      path: null,
      repository: `${sshMatch[1]}/${sshMatch[2]}`,
    };
  }

  try {
    const parsed = new URL(repoUrl);
    if (parsed.hostname.toLowerCase() !== "github.com") return null;

    const parts = parsed.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    const [owner, rawRepo] = parts;
    if (!owner || !rawRepo) return null;

    const repo = rawRepo.replace(/\.git$/i, "");
    if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
      return null;
    }

    const repository = `${owner}/${repo}`;
    if (parts.length === 2) {
      return { kind: "repository", path: null, repository };
    }

    if ((parts[2] === "tree" || parts[2] === "blob") && parts.length >= 5) {
      const path = parts.slice(4).join("/");
      if (!path || path.split("/").some((segment) => segment === "..")) return null;
      return {
        kind: parts[2] === "blob" ? "file" : "directory",
        path,
        repository,
      };
    }

    return null;
  } catch {
    return null;
  }
}

function githubHeaders(accept = "application/vnd.github+json"): HeadersInit {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return {
    Accept: accept,
    Authorization: `Bearer ${token}`,
    "User-Agent": "rosclaw-registry-sync",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function fetchGitHubRepository(repository: string): Promise<GitHubRepository> {
  const response = await fetch(`${GITHUB_API_URL}/repos/${repository}`, {
    headers: githubHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    throw new Error(
      `GitHub repository request failed (${response.status}${remaining === "0" ? ", rate limit exhausted" : ""})`
    );
  }

  return (await response.json()) as GitHubRepository;
}

async function fetchGitHubReadme(repository: string): Promise<string> {
  const response = await fetch(`${GITHUB_API_URL}/repos/${repository}/readme`, {
    headers: githubHeaders("application/vnd.github.raw+json"),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (response.status === 404) return "";
  if (!response.ok) {
    throw new Error(`GitHub README request failed (${response.status})`);
  }

  return response.text();
}

async function fetchGitHubFile(
  repository: string,
  path: string,
  ref: string
): Promise<string | null> {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = new URL(`${GITHUB_API_URL}/repos/${repository}/contents/${encodedPath}`);
  url.searchParams.set("ref", ref);

  const response = await fetch(url, {
    headers: githubHeaders("application/vnd.github.raw+json"),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub content request failed (${response.status})`);
  }

  return response.text();
}

async function fetchRegistryDocument(
  source: GitHubSource,
  type: RegistryType,
  defaultBranch: string
): Promise<string> {
  if (source.kind === "file" && source.path) {
    return (await fetchGitHubFile(source.repository, source.path, defaultBranch)) || "";
  }

  if (source.kind === "directory" && source.path) {
    const candidates =
      type === "skill"
        ? ["SKILL.md", "skill.md", "README.md", "readme.md"]
        : ["README.md", "readme.md"];

    for (const filename of candidates) {
      const content = await fetchGitHubFile(
        source.repository,
        `${source.path}/${filename}`,
        defaultBranch
      );
      if (content !== null) return content;
    }
    return "";
  }

  if (type === "skill") {
    for (const filename of ["SKILL.md", "skill.md"]) {
      const content = await fetchGitHubFile(source.repository, filename, defaultBranch);
      if (content !== null) return content;
    }
  }

  return fetchGitHubReadme(source.repository);
}

function versionFromTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "1.0.0";

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function timestampsMatch(left: string | null, right: string): boolean {
  if (!left) return false;
  return new Date(left).getTime() === new Date(right).getTime();
}

function parseToolsFromLlm(content: string): Array<{ name: string; description: string }> {
  const jsonMatch =
    content.match(/```json\s*([\s\S]*?)\s*```/) ||
    content.match(/```\s*([\s\S]*?)\s*```/);
  const parsed = JSON.parse(jsonMatch?.[1] || content) as {
    tools?: unknown;
  };

  if (!Array.isArray(parsed.tools)) return [];

  return parsed.tools.flatMap((tool) => {
    if (!tool || typeof tool !== "object") return [];
    const candidate = tool as Record<string, unknown>;
    if (typeof candidate.name !== "string" || !candidate.name.trim()) return [];

    return [
      {
        name: candidate.name.trim(),
        description:
          typeof candidate.description === "string" ? candidate.description.trim() : "",
      },
    ];
  });
}

async function analyzeMcpTools(
  repository: string,
  description: string,
  readme: string
): Promise<Array<{ name: string; description: string }> | null> {
  const apiKey = process.env.BAILIAN_API_KEY;
  if (!apiKey || !readme) return null;

  const response = await fetch(
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [
          {
            role: "system",
            content:
              "You extract MCP tool definitions from repository documentation and return valid JSON only.",
          },
          {
            role: "user",
            content: `Extract every MCP tool from this repository README.\n\nRepository: ${repository}\nDescription: ${description || "N/A"}\n\nREADME:\n${readme.slice(0, 8000)}\n\nReturn only: {"tools":[{"name":"tool_name","description":"What the tool does"}]}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    }
  );

  if (!response.ok) {
    throw new Error(`MCP tool analysis failed (${response.status})`);
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = result.choices?.[0]?.message?.content;
  if (!content) return null;

  return parseToolsFromLlm(content);
}

async function loadDueItems(cutoff: string, force: boolean): Promise<RegistryItem[]> {
  const supabase = getSupabaseAdmin();
  const maxItems = readBoundedInteger(
    process.env.GITHUB_SYNC_MAX_ITEMS,
    DEFAULT_MAX_ITEMS,
    1,
    1000
  );
  const columns =
    "id,name,description,github_repo_url,github_updated_at,last_synced_at,readme_content";

  const loadTable = async (table: RegistryTable, type: RegistryType) => {
    let query = supabase
      .from(table)
      .select(columns)
      .not("github_repo_url", "is", null)
      .order("last_synced_at", { ascending: true, nullsFirst: true })
      .limit(maxItems);

    if (!force) {
      query = query.or(`last_synced_at.is.null,last_synced_at.lt.${cutoff}`);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to load ${table}: ${error.message}`);

    return (data || []).map((item) => ({
      ...(item as Omit<RegistryItem, "type" | "table">),
      type,
      table,
    }));
  };

  const [mcps, skills] = await Promise.all([
    loadTable("mcp_packages", "mcp"),
    loadTable("skills", "skill"),
  ]);

  return [...mcps, ...skills]
    .sort((left, right) => {
      if (!left.last_synced_at) return -1;
      if (!right.last_synced_at) return 1;
      return left.last_synced_at.localeCompare(right.last_synced_at);
    })
    .slice(0, maxItems);
}

async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < tasks.length) {
      const index = nextIndex++;
      try {
        results[index] = { status: "fulfilled", value: await tasks[index]() };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker())
  );
  return results;
}

export async function syncGitHubRegistry(options?: {
  force?: boolean;
}): Promise<RegistrySyncResult> {
  const force = options?.force === true;
  const intervalDays = DEFAULT_SYNC_INTERVAL_DAYS;
  // The previous run completes seconds after 19:15 UTC. Without a small grace
  // window, the next 19:15 invocation would miss the five-day cutoff and wait
  // until day six.
  const cutoff = new Date(
    Date.now() - intervalDays * 24 * 60 * 60 * 1000 + SCHEDULE_GRACE_MINUTES * 60 * 1000
  ).toISOString();
  const items = await loadDueItems(cutoff, force);
  const failures: SyncFailure[] = [];
  let skipped = 0;

  const repositories = new Map<string, ResolvedRegistryItem[]>();
  for (const item of items) {
    const source = parseGitHubSource(item.github_repo_url);
    if (!source) {
      skipped += 1;
      failures.push({ repository: item.github_repo_url, message: "Invalid GitHub URL" });
      continue;
    }
    repositories.set(source.repository, [
      ...(repositories.get(source.repository) || []),
      { item, source },
    ]);
  }

  const tasks = Array.from(repositories.entries()).map(
    ([repository, repoItems]) => async () => {
      const repo = await fetchGitHubRepository(repository);
      const sourceUpdatedAt = repo.pushed_at || repo.updated_at;
      const syncedAt = new Date().toISOString();
      const version = versionFromTimestamp(sourceUpdatedAt);
      const supabase = getSupabaseAdmin();

      const itemTasks = repoItems.map(({ item, source }) => async () => {
        const needsDocument =
          !item.readme_content || !timestampsMatch(item.github_updated_at, sourceUpdatedAt);
        const document = needsDocument
          ? await fetchRegistryDocument(source, item.type, repo.default_branch)
          : null;
        let tools: Array<{ name: string; description: string }> | null = null;

        if (
          item.type === "mcp" &&
          document !== null &&
          document !== item.readme_content &&
          process.env.BAILIAN_API_KEY
        ) {
          try {
            tools = await analyzeMcpTools(
              repository,
              repo.description || item.description || "",
              document
            );
          } catch (error) {
            console.error(`[github-sync] ${repository}:`, error);
          }
        }

        const update: Record<string, unknown> = {
          github_forks: repo.forks_count,
          github_stars: repo.stargazers_count,
          github_updated_at: sourceUpdatedAt,
          last_synced_at: syncedAt,
          version,
        };

        if (!item.description && repo.description) update.description = repo.description;
        if (document !== null) update.readme_content = document;
        if (item.type === "mcp" && tools && tools.length > 0) update.tools = tools;

        const { error } = await supabase.from(item.table).update(update).eq("id", item.id);
        if (error) throw new Error(`${item.name}: ${error.message}`);
        return item.name;
      });

      const itemResults = await runWithConcurrency(itemTasks, DEFAULT_CONCURRENCY);
      const itemFailures = itemResults.flatMap((result) =>
        result.status === "rejected"
          ? [result.reason instanceof Error ? result.reason.message : String(result.reason)]
          : []
      );

      return {
        failed: itemFailures.length,
        failures: itemFailures,
        succeeded: itemResults.length - itemFailures.length,
      };
    }
  );

  const concurrency = readBoundedInteger(
    process.env.GITHUB_SYNC_CONCURRENCY,
    DEFAULT_CONCURRENCY,
    1,
    20
  );
  const results = await runWithConcurrency(tasks, concurrency);
  let succeeded = 0;
  let failed = skipped;

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      succeeded += result.value.succeeded;
      failed += result.value.failed;
      if (result.value.failures.length > 0) {
        const repository = Array.from(repositories.keys())[index];
        failures.push(
          ...result.value.failures.map((message) => ({ repository, message }))
        );
      }
      return;
    }

    const repository = Array.from(repositories.keys())[index];
    const count = repositories.get(repository)?.length || 1;
    failed += count;
    failures.push({
      repository,
      message: result.reason instanceof Error ? result.reason.message : String(result.reason),
    });
  });

  return {
    due: items.length,
    failed,
    failures: failures.slice(0, 25),
    forced: force,
    intervalDays,
    repositories: repositories.size,
    skipped,
    succeeded,
  };
}
