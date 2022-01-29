import {Pool, PoolClient, QueryResultRow} from 'pg';

let pool: Pool | undefined;

export function setPool(p: Pool, schema?: string) {
    pool = p;
    pool.on('connect', (client) => {
        client.query(`SET search_path TO ${schema}`);
    });
}

export function createQuery(client: PoolClient | Pool) {
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
        }, '');
        return client.query<R, I>(text, values);
    }

    return query;
}

export function query<R extends QueryResultRow = any, I extends any[] = any[]>(
    literals: ReadonlyArray<string>,
    ...values: I
) {
    if (!pool) {
        throw new Error('pg pool not set');
    }
    let text = literals.reduce((queryText, literal, i) => {
        if (i !== literals.length - 1) {
            return queryText + literal + `$${i + 1}`;
        } else {
            return queryText + literal;
        }
    }, '');
    return pool.query<R, I>(text, values);
}

export async function transaction(func: (q: typeof query) => Promise<void>) {
    if (!pool) {
        throw new Error('pg pool not set');
    }
    let client = await pool.connect();
    const q = createQuery(client);
    q`BEGIN`;
    try {
        await func(q);
        q`COMMIT`;
    } catch (e) {
        q`ROLLBACK`;
        throw e;
    }
}
