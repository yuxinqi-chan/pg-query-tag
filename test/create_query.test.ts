import { createQuery } from '../src';
const query = createQuery('postgres://postgres:admin@localhost:5432/postgres');
query`select * from test`.then(res => {
    console.log(res.rows);
    query.client.end()
})