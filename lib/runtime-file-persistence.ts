import "server-only";

export function canPersistRuntimeFiles() {
  return process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1";
}
