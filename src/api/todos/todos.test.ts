import request from "supertest";
import app from "../../app";
import { Todos } from "./todos.model";

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (err) {
    console.log(err);
  }
});

//test to make sure todos have something inside it
describe("GET /api/v1/todos", () => {
  it("responds with a array of todos", async () =>
    request(app)
      .get("/api/v1/todos")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("length");
        expect(response.body.length).toBeGreaterThanOrEqual(0);
        if (response.body.length > 0) {
          console.log("First todo:", response.body[0]);
          expect(response.body[0]).toHaveProperty("content");
          expect(response.body[0]).toHaveProperty("done");
        }
      }));
});

let id = " ";

describe("POST /api/v1/todos", () => {
  it("responds with invalid todo object", async () => {
    await request(app)
      .post("/api/v1/todos")
      .set("Accept", "application/json")
      .send({
        content: "",
      })
      .expect("Content-Type", /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
      });
  });

  it("responds with inserted object", async () => {
    const todoData = {
      content: "Learn Typescript",
      done: false,
    };

    // Send a POST request and wait for the response
    const response = await request(app)
      .post("/api/v1/todos")
      .set("Accept", "application/json")
      .send(todoData);

    // Check the response status and body
    expect(response.status).toBe(201);
    const insertedTodo = response.body;

    // Verify properties of the inserted todo object
    expect(insertedTodo).toHaveProperty("_id");
    id = response.body._id;
    expect(insertedTodo).toHaveProperty("content", todoData.content);
    expect(insertedTodo).toHaveProperty("done", todoData.done);
  });
});

describe("GET /api/v1/todos/:id", () => {
  it("responds with a single todo", async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("content");
        expect(response.body).toHaveProperty("done");
        expect(response.body._id).toBe(id);

        console.log(id);
      }));

  it("responds with a 404 for invalid id", (done) => {
    request(app)
      .get(`/api/v1/todos/12afdsfasdf3`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422)
      .then((response=>{
      console.log(response.body.message)
      done()
      }))
  });
  it('responds with a not found error', (done)=>{
    request(app)
    .get('/api/v1/todos/60f3b3b3b3b3b3b3b3b3b3b3')
.set('Accept', 'application/json')
.expect('Content-Type', /json/)
.expect(404, done)
  })
});
