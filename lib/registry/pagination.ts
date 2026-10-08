export const REGISTRY_BATCH_SIZE = 500;
export const REGISTRY_PAGE_SIZE = 24;

interface RegistryBatch<T> {
  data: T[] | null;
  error: { message: string } | null;
  count: number | null;
}

/** Read all rows, including projects configured with a smaller response cap. */
export async function readAllRegistryRows<T>(
  load: (from: number, to: number, signal: AbortSignal) => PromiseLike<RegistryBatch<T>>,
  timeoutMs = 8000,
): Promise<T[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("Registry query timeout")), timeoutMs);
  try {
    const rows: T[] = [];
    let total: number | null = null;
    do {
      controller.signal.throwIfAborted();
      const batch = await load(rows.length, rows.length + REGISTRY_BATCH_SIZE - 1, controller.signal);
      if (batch.error) throw new Error(batch.error.message);
      if (batch.count === null) throw new Error("Registry count is unavailable");
      total = batch.count;
      if (!batch.data?.length) {
        if (rows.length < total) throw new Error("Registry pagination returned an incomplete catalog");
        break;
      }
      rows.push(...batch.data);
    } while (rows.length < total);
    return rows;
  } finally {
    clearTimeout(timer);
  }
}

export function registryPath(name: string) {
  return name.split("/").map(encodeURIComponent).join("/");
}

export function parseRegistryPage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export function registryPageUrl(base: string, page: number) {
  return page <= 1 ? base : `${base}?page=${page}`;
}
