import type { AnalyticsEventName } from "./events";
import { createAnalyticsEvent } from "./events";
export function track(name: AnalyticsEventName, properties: Record<string, string | number | boolean | undefined> = {}) {
  const event = createAnalyticsEvent(name, properties);
  if (process.env.NODE_ENV === "development") console.info("[Presentei event]", event);
  return event;
}
