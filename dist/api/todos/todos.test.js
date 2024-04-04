"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const todos_model_1 = require("./todos.model");
let server;
beforeAll(async () => {
    try {
        await todos_model_1.Todos.drop();
        server = app_1.default.listen(); // Start the server and store the instance
    }
    catch (err) {
        console.log(err);
    }
});
afterAll(async () => {
    await server.close(); // Close the server after all tests are done
});
//test to make sure todos have something inside it
describe('GET /api/v1/todos', () => {
    it('responds with a array of todos', async () => (0, supertest_1.default)(app_1.default)
        .get('/api/v1/todos')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBeGreaterThanOrEqual(0);
        if (response.body.length > 0) {
            console.log('First todo:', response.body[0]);
            expect(response.body[0]).toHaveProperty('content');
            expect(response.body[0]).toHaveProperty('done');
        }
    }));
});
describe('POST /api/v1/todos', () => {
    it('responds with inserted object', async () => {
        const todoData = {
            content: 'Learn Typescript',
            done: false,
        };
        // Send a POST request and wait for the response
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/todos')
            .send(todoData)
            .set('Accept', 'application/json');
        // Check the response status and body
        expect(response.status).toBe(201);
        const insertedTodo = response.body;
        // Verify properties of the inserted todo object
        expect(insertedTodo).toHaveProperty('_id');
        expect(insertedTodo).toHaveProperty('content', todoData.content);
        expect(insertedTodo).toHaveProperty('done', todoData.done);
        expect(insertedTodo.body).toBe('Learn Typescript');
    }, 10000);
});
//# sourceMappingURL=todos.test.js.map