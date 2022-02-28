import { Pool } from "pg";
import { query, setPool } from "../src";

let pool = new Pool({ connectionString: "postgresql://postgres:admin@localhost:5432/postgres" });
setPool(pool)
query`select * from test`.then(res => {
    console.log(res.rows);
    pool.end()
})