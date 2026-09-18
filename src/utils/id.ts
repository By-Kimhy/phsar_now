export function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function nowIso(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}
