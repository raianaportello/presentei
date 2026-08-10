export type AnalyticsEventName = "product_viewed" | "personalizer_started" | "business_quote_started" | "cart_updated";
export function createAnalyticsEvent(name: AnalyticsEventName, properties: Record<string, string | number | boolean | undefined>) {
  return { name, version: 1 as const, properties: Object.fromEntries(Object.entries(properties).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)) };
}
