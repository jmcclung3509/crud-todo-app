import request from 'supertest';
import app from '../../app';
import { Todos } from './todos.model';
import mongoose from 'mongoose';
import { resolveSoa } from 'dns';

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (err) {
    console.log(err);
  }
});

//test to make sure todos have something inside it
describe('GET /api/v1/todos', () => {
  it('responds with a array of todos', async () =>
    request(app)
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

    return request(app)
      .post('/api/v1/todos') // Send a POST request
      .send(todoData) // Send todo data in the request body
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        console.log(response.body)
        const insertedTodo = response.body;

        // Verify properties of the inserted todo object
        expect(insertedTodo).toHaveProperty('_id');
        expect(insertedTodo).toHaveProperty('content', todoData.content);
        expect(insertedTodo).toHaveProperty('done', todoData.done);
      });
  });
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});