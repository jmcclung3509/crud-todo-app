"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOne = exports.findAll = void 0;
const todos_model_1 = require("./todos.model");
const zod_1 = require("zod");
async function findAll(_req, res, next) {
    console.log('findAll route handler invoked');
    try {
        const result = await todos_model_1.Todos.find();
        const todos = await result.toArray();
        res.json(todos);
    }
    catch (error) {
        next(error);
    }
}
exports.findAll = findAll;
async function createOne(req, res, next) {
    try {
        const validateResult = await todos_model_1.Todo.parse(req.body);
        const insertResult = await todos_model_1.Todos.insertOne(validateResult);
        if (!insertResult.acknowledged) {
            throw new Error('Insertion failed');
        }
        res.json({
            _id: insertResult.insertedId,
            ...validateResult,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(422);
        }
        next(error);
    }
}
exports.createOne = createOne;
//# sourceMappingURL=todos.handlers.js.map