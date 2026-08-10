import { expect, it } from "vitest";
import { createAnalyticsEvent } from "./events";
it("remove valores indefinidos e inclui versão", () => {
  expect(createAnalyticsEvent("product_viewed", { productId: "p1", category: undefined })).toEqual({ name: "product_viewed", version: 1, properties: { productId: "p1" } });
});
