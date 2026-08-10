const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatMoney(cents: number) {
  if (!Number.isInteger(cents)) throw new Error("Valor monetário inválido");
  return brl.format(cents / 100).replace(/\u00a0/g, " ");
}
