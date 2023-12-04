import { Item } from '../entity/item.entity'
import bodyParser  from 'body-parser'
import { Request, Response } from "express"
import { check, validationResult } from 'express-validator';
import session from 'express-session';

var urlencodedParser = bodyParser.urlencoded({ extended: false })

export default function (app: any, dbDataSource: any) {
    app.get('/todo', async function (req: Request, res: Response) {
        const  items = await dbDataSource.getRepository(Item).find({
            order: {
                id: "DESC"
            }
        })
        if (req.session.errors) {
            const errors = req.session.errors;
            req.session.errors = [];

            return res.render('todo', {
                todos: items,
                errors: errors
            });
        }
        return res.render('todo', {
            todos: items
        });
    });

    app.post('/todo', [urlencodedParser,
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
                return res.redirect('/todo')
            }
            const itemObject = await dbDataSource.getRepository(Item).create(req.body)
            const item = await dbDataSource.getRepository(Item).save(itemObject)
            return res.redirect('/todo')
        } catch (err) {
            console.log(err)
            req.session.errors = [{msg: "Somehting happened, or email is duplicated"}]
            return res.redirect('/todo')
        }
    });

    app.delete("/todo/:id", async function (req: Request, res: Response) {
        try {
            const results = await dbDataSource.getRepository(Item).delete(req.params.id)
            return res.json(results)
        } catch (err) {
            console.log(err)
        }
    })
}