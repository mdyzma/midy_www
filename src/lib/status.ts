export const statuses = ['up', 'down', 'maintenance', 'unknown'] as const;
export type Status = typeof statuses[number];
export interface Monitor { id: string; name: string; tags: string[]; status: Status; responseMs: number | null }
export interface Snapshot { version: 1; demo: boolean; generatedAt: string; monitors: Monitor[] }

export function parseSnapshot(input: unknown): Snapshot {
  if (!input || typeof input !== 'object') throw new Error('Invalid snapshot');
  const value = input as Record<string, unknown>;
  if (value.version !== 1 || typeof value.demo !== 'boolean' || typeof value.generatedAt !== 'string' || !Number.isFinite(Date.parse(value.generatedAt)) || !Array.isArray(value.monitors) || value.monitors.length > 500) throw new Error('Invalid snapshot');
  const monitors = value.monitors.map((item: unknown): Monitor => {
    if (!item || typeof item !== 'object') throw new Error('Invalid monitor');
    const row = item as Record<string, unknown>;
    if (typeof row.id !== 'string' || typeof row.name !== 'string' || !row.name.trim() || !Array.isArray(row.tags) || !row.tags.every(tag => typeof tag === 'string') || !statuses.includes(row.status as Status) || !(row.responseMs === null || (typeof row.responseMs === 'number' && Number.isFinite(row.responseMs) && row.responseMs >= 0))) throw new Error('Invalid monitor');
    return { id: row.id, name: row.name, tags: [...new Set(row.tags as string[])], status: row.status as Status, responseMs: row.responseMs as number | null };
  });
  if (new Set(monitors.map(row => row.id)).size !== monitors.length) throw new Error('Duplicate monitor IDs');
  return { version: 1, demo: value.demo, generatedAt: value.generatedAt, monitors };
}

export function freshness(snapshot: Snapshot, now = Date.now()) {
  if (snapshot.demo) return 'Demo data · not connected to Uptime Kuma';
  const age = now - Date.parse(snapshot.generatedAt);
  if (age < -300_000) return 'Check snapshot timestamp · it is in the future';
  return age > 26 * 60 * 60 * 1000 ? 'Snapshot overdue · showing the last available results' : 'Daily snapshot · not live';
}

export function formatSnapshotTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Warsaw' }).format(new Date(value)) + ' · Europe/Warsaw';
}
