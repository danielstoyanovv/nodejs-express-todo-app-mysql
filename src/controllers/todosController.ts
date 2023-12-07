import { Item } from '../entity/item.entity'
import bodyParser  from 'body-parser'
import { Request, Response } from "express"
import { check, validationResult } from 'express-validator';

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

    app.post('/todos', [urlencodedParser,
        check('task', 'Task length is between 5 and 20 characters')
            .isLength({ min: 5,  max: 20 }),
        check('email', 'Email is not valid').isEmail(),
        check('phone', 'Phone length is between 10 and 20 digits').isLength({ min: 10,  max: 20 })
            .isNumeric().withMessage('Phone should be only digits')
    ],  async function (req: Request, res: Response) {
        try {
            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.session.errors = errors.array()
                return res.redirect('/todos')
            }
            const itemObject = await dbDataSource.getRepository(Item).create(req.body)
            const item = await dbDataSource.getRepository(Item).save(itemObject)
            return res.redirect('/todos')
        } catch (err) {
            console.log(err)
            req.session.errors = [{msg: "Somehting happened, or email is duplicated"}]
            return res.redirect('/todos')
        }
    });

    app.get("/todos/:id", async function (req: Request, res: Response) {
        dbDataSource.getRepository(Item).findOne({
            where: {
                id: req.params.id
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

    app.post('/todos/:id', [urlencodedParser,
        check('task', 'Task length is between 5 and 20 characters')
            .isLength({ min: 5,  max: 20 }),
        check('email', 'Email is not valid').isEmail(),
        check('phone', 'Phone length is between 10 and 20 digits').isLength({ min: 10,  max: 20 })
            .isNumeric().withMessage('Phone should be only digits')
    ],  async function (req: Request, res: Response) {
        try {
            const id = req.params.id
            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.session.errors = errors.array()
                return res.redirect('/todos/' + id)
            }
            await dbDataSource
                .createQueryBuilder()
                .update(Item)
                .set(req.body)
                .where("id = :id", { id: id })
                .execute()
            return res.redirect('/todos/' + id)
        } catch (err) {
            console.log(err)
            req.session.errors = [{msg: "Somehting happened, or email is duplicated"}]
            return res.redirect('/todos/' + req.params.id)
        }
    });

    app.delete("/todos/:id", async function (req: Request, res: Response) {
        try {
            const results = await dbDataSource.getRepository(Item).delete(req.params.id)
            return res.json(results)
        } catch (err) {
            console.log(err)
        }
    })
}