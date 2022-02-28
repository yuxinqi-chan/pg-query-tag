import { Pool, Client, QueryResultRow } from "pg";

let pool: Pool | undefined;

export function setPool(p: Pool, schema?: string | null) {
  pool = p;
  if (schema) {
    pool.on("connect", (client) => {
      client.query(`SET search_path TO ${schema}`);
    });
  }
}

export function createQuery(client: Client | Pool | string) {
  let _client: Client | Pool;
  if (typeof client === "string") {
    _client = new Pool({ connectionString: client });
  } else {
    _client = client;
  }
  function query<R extends QueryResultRow = any, I extends any[] = any[]>(
    literals: ReadonlyArray<string>,
    ...values: I
  ) {
    let text = literals.reduce((queryText, literal, i) => {
      if (i !== literals.length - 1) {
        return queryText + literal + `$${i + 1}`;
      } else {
        return queryText + literal;
      }
    }, "");
    return _client.query<R, I>(text, values);
  }
  query.client = _client;
  return query;
}

export function query<R extends QueryResultRow = any, I extends any[] = any[]>(
  literals: ReadonlyArray<string>,
  ...values: I
) {
  if (!pool) {
    throw new Error("pg pool not set");
  }
  let text = literals.reduce((queryText, literal, i) => {
    if (i !== literals.length - 1) {
      return queryText + literal + `$${i + 1}`;
    } else {
      return queryText + literal;
    }
  }, "");
  return pool.query<R, I>(text, values);
}

export async function transaction<R>(func: (q: typeof query) => Promise<R>) {
  if (!pool) {
    throw new Error("pg pool not set");
  }
  let client = await pool.connect();
  const q = function query<R extends QueryResultRow = any, I extends any[] = any[]>(
    literals: ReadonlyArray<string>,
    ...values: I
  ) {
    let text = literals.reduce((queryText, literal, i) => {
      if (i !== literals.length - 1) {
        return queryText + literal + `$${i + 1}`;
      } else {
        return queryText + literal;
      }
    }, "");
    return client.query<R, I>(text, values);
  };
  q`BEGIN`;
  try {
    let result = await func(q);
    q`COMMIT`;
    return result;
  } catch (e) {
    q`ROLLBACK`;
    throw e;
  }
}
