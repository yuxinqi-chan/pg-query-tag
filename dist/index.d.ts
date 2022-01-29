import { Pool, PoolClient, QueryResultRow } from 'pg';
export declare function setPool(p: Pool, schema?: string | null): void;
export declare function createQuery(client: PoolClient | Pool): <R extends QueryResultRow = any, I extends any[] = any[]>(literals: ReadonlyArray<string>, ...values: I) => Promise<import("pg").QueryResult<R>>;
export declare function query<R extends QueryResultRow = any, I extends any[] = any[]>(literals: ReadonlyArray<string>, ...values: I): Promise<import("pg").QueryResult<R>>;
export declare function transaction<R>(func: (q: typeof query) => Promise<R>): Promise<R>;
