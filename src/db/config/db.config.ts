
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'basic_nest_backend',
    username: 'root',
    password: 'rootroot',
    entities: ["dist/**/*.entity{ .ts,.js}"],
    migrations: ["dist/db/migrations/*{.ts,.js}"],
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
