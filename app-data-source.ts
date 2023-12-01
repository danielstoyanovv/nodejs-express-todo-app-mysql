import "reflect-metadata"
import { DataSource } from "typeorm"

export const dbDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "qJvjwTty",
    database: "todos",
    entities: [__dirname + '/src/entity/*.entity.js'],
    logging: true,
    synchronize: true,
})