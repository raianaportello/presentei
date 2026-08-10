import { expect, it } from "vitest";
import { requireAdmin } from "./require-admin";
it("bloqueia sessão sem papel administrativo", () => {
  expect(() => requireAdmin({ user: { role: "CUSTOMER" } })).toThrow("Acesso administrativo necessário");
});
