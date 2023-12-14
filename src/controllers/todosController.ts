import { Item } from '../entity/item.entity'
import bodyParser  from 'body-parser'
import { Request, Response } from "express"
import {ItemFactory} from "../factories/ItemFactory"
import { validate } from "class-validator"

var urlencodedParser = bodyParser.urlencoded({ extended: false })

export default function (app: any, dbDataSource: any) {
    app.get('/todos', async function (req: Request, res: Response) {
        const  items = await dbDataSource.getRepository(Item).find({
            select: {
                task: true,
                id: true
            },
            order: {
                id: "DESC"
            }
        })
        if (req.session.errors) {
            const errors = req.session.errors;
            req.session.errors = [];

            return res.render('todos/index', {
                todos: items,
                errors: errors
            });
        }
        return res.render('todos/index', {
            todos: items
        });
    });

    app.post('/todos', [urlencodedParser],  async function (req: Request, res: Response) {
        try {
            const data = await getValidatedItemOrErrors(req, res)
            if (data instanceof Item) {
                await dbDataSource.getRepository(Item).save(data)
            }
            return res.redirect('/todos')
        } catch (err) {
            console.log(err)
            req.session.errors = ["Somehting happened, or email is duplicated"]
            return res.redirect('/todos')
        }
    });

    app.get("/todos/:id", async function (req: Request, res: Response) {
        const { id } = req.params
        dbDataSource.getRepository(Item).findOne({
            where: {
                id: id
            }
        }).then(function (result: object) {
            if (req.session.errors) {
                const errors = req.session.errors;
                req.session.errors = [];

                return res.render('todos/update', {
                    errors: errors,
                    item: result
                });
            }
            return res.render('todos/update', {
                item: result
            });
        }).catch(function (err: object) {
            console.log(err)
        })
    })

    app.post('/todos/:id', [urlencodedParser],  async function (req: Request, res: Response) {
        try {
            const { id } = req.params
            const data = await getValidatedItemOrErrors(req, res)
            if (data instanceof Item) {
                await dbDataSource
                    .createQueryBuilder()
                    .update(Item)
                    .set(req.body)
                    .where("id = :id", { id: id })
                    .execute()
            }
            return res.redirect('/todos/' + id)
        } catch (err) {
            console.log(err)
            req.session.errors = ["Somehting happened, or email is duplicated"]
            return res.redirect('/todos/' + req.params.id)
        }
    });

    app.delete("/todos/:id", async function (req: Request, res: Response) {
        try {
            const { id } = req.params
            const results = await dbDataSource.getRepository(Item).delete(id)
            return res.json(results)
        } catch (err) {
            console.log(err)
        }
    })

    async function getValidatedItemOrErrors(req: Request, res: Response) {
        const item = ItemFactory.new()
        const {task, email, phone} = req.body
        item.task = task
        item.email = email
        item.phone = phone
        const errors = await validate(item)
        if (errors.length > 0) {
            const messages: any = []
            errors.forEach(error => {
                if (error.constraints) {
                    messages.push(Object.values(error.constraints))
                }
            })
            if (messages.length > 0) {
                req.session.errors = messages
                return messages
            }
        }
        return item
    }
}