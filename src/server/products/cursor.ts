import "server-only";

/** Posição do último item de uma página, na ordem (created_at desc, id desc). */
export type ProductCursor = { createdAt: string; id: string };

export class InvalidCursorError extends Error {
  constructor() {
    super("Cursor inválido.");
    this.name = "InvalidCursorError";
  }
}

// Timestamp exatamente como o Postgres devolve (até microssegundos). Não passa por
// `Date`, que cortaria os microssegundos e faria a paginação pular itens.
const TIMESTAMP_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

/** Codifica `created_at|id` em base64url. O cliente trata o valor como opaco. */
export function encodeCursor(cursor: ProductCursor): string {
  return Buffer.from(`${cursor.createdAt}|${cursor.id}`, "utf8").toString(
    "base64url",
  );
}

/** Decodifica e valida o cursor. Lança `InvalidCursorError` se algo não bater. */
export function decodeCursor(value: string): ProductCursor {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new InvalidCursorError();

  const decoded = Buffer.from(value, "base64url").toString("utf8");
  const separator = decoded.lastIndexOf("|");
  if (separator <= 0) throw new InvalidCursorError();

  const createdAt = decoded.slice(0, separator);
  const id = decoded.slice(separator + 1);
  if (
    !TIMESTAMP_RE.test(createdAt) ||
    Number.isNaN(Date.parse(createdAt)) ||
    !ID_RE.test(id)
  ) {
    throw new InvalidCursorError();
  }

  return { createdAt, id };
}
