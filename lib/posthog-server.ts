import { PostHog } from "posthog-node";

const key =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  "phc_yRSKUoUhg56ijGwnZCJhPH3ozSQSv2YnLQx5RYp6fUVy";

const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export async function captureServer(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  if (!key) return;
  const ph = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  ph.capture({ distinctId, event, properties });
  await ph.shutdown();
}
