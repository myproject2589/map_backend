import {API_DB_HOST, API_DB_NAME, API_DB_PASSWORD, API_DB_PORT, API_DB_USERNAME} from "./constants";

export const dbConfig = {
    user: API_DB_USERNAME,
    password: API_DB_PASSWORD,
    database: API_DB_NAME,
    server: API_DB_HOST,
    port: Number(API_DB_PORT),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}
