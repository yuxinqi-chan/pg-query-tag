import { Pool, Client, QueryResultRow } from "pg";
export declare function setPool(p: Pool, schema?: string | null): void;
export declare function createQuery(client: Client | Pool | string): {
    <R extends QueryResultRow = any, I extends any[] = any[]>(literals: ReadonlyArray<string>, ...values: I): Promise<import("pg").QueryResult<R>>;
    client: Pool | Client;
};
export declare function query<R extends QueryResultRow = any, I extends any[] = any[]>(literals: ReadonlyArray<string>, ...values: I): Promise<import("pg").QueryResult<R>>;
export declare function transaction<R>(func: (q: typeof query) => Promise<R>): Promise<R>;
