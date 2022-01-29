# pg-query-tag

## Install

```bash
npm install pg-query-tag
```

## Usage

### setPool

```typescript
import {Pool} from 'pg';
import {query, setPool, transaction} from 'pg-query-tag';

const pool = new Pool({
    connectionString: 'postgres://postgres:postgres@localhost:5432/postgres',
})
// setPool before use query
setPool(pool);
//or set pool and schema
setPool(pool, 'public');
```

### query

```typescript
//...
const id = 1;
const result = await query`select * from users where id = ${id}`;
console.log(result.rows)
```

### transaction

```typescript
//...
const id = 1;
const name = 'user1';
const result = await transaction(async (query) => {
    await query`insert into users (id,name) values (${id},${name})`;
    return await query`select * from users where id = ${id}`;
});
console.log(result.rows)
```
