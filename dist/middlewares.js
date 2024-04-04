"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.errorHandler = exports.notFound = void 0;
const zod_1 = require("zod");
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
exports.notFound = notFound;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}
exports.errorHandler = errorHandler;
//validate response
function validateRequest(validators) {
    return async (req, res, next) => {
        try {
            if (validators.params) {
                req.params = await validators.params.parseAsync(req.params);
            }
            if (validators.query) {
                req.query = await validators.query.parseAsync(req.query);
            }
            if (validators.body) {
                req.body = await validators.body.parseAsync(req.body);
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(422);
            }
            next(error);
        }
    };
}
exports.validateRequest = validateRequest;
//# sourceMappingURL=middlewares.js.map