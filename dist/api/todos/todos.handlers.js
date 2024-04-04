"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOne = exports.findAll = void 0;
const todos_model_1 = require("./todos.model");
async function findAll(_req, res, next) {
    console.log("findAll route handler invoked");
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
        const insertResult = await todos_model_1.Todos.insertOne(req.body);
        if (!insertResult.acknowledged) {
            throw new Error("Insertion failed");
        }
        res.status(201);
        res.json({
            _id: insertResult.insertedId,
            ...req.body,
        });
    }
    catch (error) {
        next(error);
    }
}
exports.createOne = createOne;
//# sourceMappingURL=todos.handlers.js.map