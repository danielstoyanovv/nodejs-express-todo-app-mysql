import express from 'express';
import todosController from './controllers/todosController'
import { dbDataSource } from "../app-data-source"
import session from 'express-session'

dbDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app = express()

app.use(session({secret: '123456', resave: true, saveUninitialized: true}))

declare module "express-session" {
    interface SessionData {
        errors: object
    }
}

app.set('view engine', 'ejs')

const port = 4000

app.use(express.static('./public'));

app.use(express.json())


app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

todosController(app, dbDataSource);