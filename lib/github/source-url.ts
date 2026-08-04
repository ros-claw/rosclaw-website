export type RegistryAssetType = "mcp" | "skill";

interface GitHubSourceLocation {
  owner: string;
  repository: string;
  kind: "repository" | "tree" | "blob";
  ref?: string;
  path?: string;
}

const OFFICIAL_SKILL_MONOREPO_PATHS = new Map([
  ["inspire_rh56_hand_gestures", "skills/inspire_rh56_hand_gestures"],
  ["realsense_camera_usage", "skills/realsense_camera_usage"],
  ["realsense_ops", "skills/realsense_ops"],
  ["ros_install", "skills/ros_install"],
]);

function parseGitHubSourceUrl(value: string): GitHubSourceLocation | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    const [owner, rawRepository, marker, ref, ...sourcePath] = parts;
    const repository = rawRepository?.replace(/\.git$/i, "");
    if (!owner || !repository) return null;
    if (!marker) return { owner, repository, kind: "repository" };
    if ((marker === "tree" || marker === "blob") && ref) {
      return {
        owner,
        repository: repository.replace(/\.git$/i, ""),
        kind: marker,
        ref,
        path: sourcePath.length > 0 ? sourcePath.join("/") : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function encodePath(path: string) {
  return path.split("/").filter(Boolean).map((part) => encodeURIComponent(part)).join("/");
}

function assetSlug(assetName: string) {
  return assetName.split("/").filter(Boolean).at(-1) || assetName;
}

function looksLikeFilePath(path: string) {
  return /(?:^|\/)[^/]+\.[a-z0-9]{1,12}$/i.test(path);
}

function officialSkillMonorepoPath(assetName: string, assetType: RegistryAssetType) {
  if (assetType !== "skill") return undefined;
  const parts = assetName.split("/").filter(Boolean);
  if (parts.length < 2 || !["ros-claw", "rosclaw"].includes(parts[0].toLowerCase())) {
    return undefined;
  }
  return OFFICIAL_SKILL_MONOREPO_PATHS.get(parts.at(-1) || "");
}

export function canonicalRegistrySourceUrl(
  value: string,
  assetName: string,
  assetType: RegistryAssetType,
): string {
  const source = parseGitHubSourceUrl(value);
  if (!source) return value;

  const officialPath = officialSkillMonorepoPath(assetName, assetType);
  if (officialPath) {
    return `https://github.com/ros-claw/skills/tree/main/${encodePath(officialPath)}`;
  }

  const repositoryRoot = `https://github.com/${encodeURIComponent(source.owner)}/${encodeURIComponent(source.repository)}`;
  if (source.kind === "repository") {
    const isOfficialSkillMonorepo =
      assetType === "skill" &&
      source.owner.toLowerCase() === "ros-claw" &&
      source.repository.toLowerCase() === "skills";
    return isOfficialSkillMonorepo
      ? `${repositoryRoot}/tree/main/skills/${encodeURIComponent(assetSlug(assetName))}`
      : repositoryRoot;
  }

  const ref = encodeURIComponent(source.ref || "main");
  const path = encodePath(source.path || "");
  const marker =
    assetType === "skill" && source.kind === "blob" && !looksLikeFilePath(source.path || "")
      ? "tree"
      : source.kind;
  return `${repositoryRoot}/${marker}/${ref}${path ? `/${path}` : ""}`;
}

function resolveSourcePath(baseDirectory: string, relativePath: string) {
  const stack = baseDirectory.split("/").filter(Boolean);
  for (const rawPart of relativePath.split("/")) {
    let part = rawPart;
    try {
      part = decodeURIComponent(rawPart);
    } catch {
      // Keep malformed percent escapes literal instead of breaking the whole README.
    }
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return encodePath(stack.join("/"));
}

export function resolveGitHubMarkdownUrl(
  sourceValue: string | undefined,
  reference: string | undefined,
  raw = false,
): string {
  if (!reference || !sourceValue) return reference || "";
  if (reference.startsWith("#")) return reference;
  if (reference.startsWith("//")) return `https:${reference}`;
  if (reference.startsWith("/")) return `https://github.com${reference}`;
  try {
    const absolute = new URL(reference);
    return ["http:", "https:", "mailto:", "tel:"].includes(absolute.protocol)
      ? reference
      : "";
  } catch {
    // Relative references are resolved against the indexed GitHub source below.
  }

  const source = parseGitHubSourceUrl(sourceValue);
  if (!source) return reference;
  const suffixIndex = reference.search(/[?#]/);
  const pathPart = suffixIndex === -1 ? reference : reference.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : reference.slice(suffixIndex);
  const sourcePath = source.path || "";
  const baseDirectory =
    source.kind === "tree" || (source.kind === "blob" && !looksLikeFilePath(sourcePath))
      ? sourcePath
      : sourcePath.split("/").slice(0, -1).join("/");
  const resolvedPath = resolveSourcePath(baseDirectory, pathPart);
  const ref = encodeURIComponent(source.ref || "main");
  const owner = encodeURIComponent(source.owner);
  const repository = encodeURIComponent(source.repository);
  return raw
    ? `https://raw.githubusercontent.com/${owner}/${repository}/${ref}/${resolvedPath}${suffix}`
    : `https://github.com/${owner}/${repository}/blob/${ref}/${resolvedPath}${suffix}`;
}
