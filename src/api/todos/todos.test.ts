import request from "supertest";
import app from "../../app";
import { Todos } from "./todos.model";
import { todo } from "node:test";

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (err) {
    console.log(err);
  }
});
let id = " ";

//test to make sure todos have something inside it
describe("GET /api/v1/todos", () => {
  it("responds with a array of todos", async () =>
   await request(app)
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
   await request(app)
      .get(`/api/v1/todos/${id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("content");
        expect(response.body).toHaveProperty("done");
        expect(response.body._id).toBe(id);
      }));

  it("responds with a 404 for invalid id", (done) => {
    request(app)
      .get(`/api/v1/todos/12afdsfasdf3`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422)
      .then((response) => {
        console.log(response.body.message);
        done();
      });
  });
  it("responds with a not found error", (done) => {
    request(app)
      .put("/api/v1/todos/60f3b3b3b3b3b3b3b3b3b3b3")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404);
    done();
  });
});

describe("PUT /api/v1/todos/:id", () => {
  const todoData = {
    content: "Learn Typescript",
    done: true,
  };

  it("responds with a single todo", async () => {
    await request(app)
      .put(`/api/v1/todos/${id}`)
      .set("Accept", "application/json")
      .send(todoData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("content");
        expect(response.body).toHaveProperty("done");
        expect(response.body.done).toBe(true);
      });
  });
  it("responds with a invalid obectId error", (done) => {
    request(app)
      .put(`/api/v1/todos/12afdsfasdf3`)
      .set("Accept", "application/json")
      .send(todoData)
      .expect("Content-Type", /json/)
      .expect(422, done);
  });
  it("responds with a not found error", (done) => {
    request(app)
      .put("/api/v1/todos/asdfg")
      .set("Accept", "application/json")
      .send({
        content: "Finsih Typescript",
        done: true,
      })
      .expect("Content-Type", /json/)
      .expect(422, done);
  });
});

describe("DELETE /api/v1/todos/:id", () => {
  it("responds with a 204 status code, request has been deleted", async () => {
    await request(app)
      .delete(`/api/v1/todos/${id}`)
      .set("Accept", "application/json")
      .expect(204);
  });

  it("responds with an invalid object ID", async () => {
    await request(app)
      .delete(`/api/v1/todos/12afdsfasdf3`)
      .set("Accept", "application/json")
      .expect(422);
  });

  it("responds with a not found error", (done) => {
request(app)
      .delete("/api/v1/todos/12345677f")
      .set("Accept", "application/json")
      .expect(404);
      done()
  });

  it("responds with a not found error", async () => {
    await request(app)
      .get(`/api/v1/todos/${id}`)
      .set("Accept", "application/json")
      .expect(404);
  });
});
