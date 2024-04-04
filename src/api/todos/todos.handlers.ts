import { Response, Request, NextFunction } from "express";
import { Todo, Todos, TodoWithId } from "./todos.model";
import { InsertOneResult } from "mongodb";

import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { ObjectId } from "mongodb";


export async function findAll(
  _req: Request,
  res: Response<TodoWithId[]>,
  next: NextFunction
) {
  console.log("findAll route handler invoked");
  try {
    const result = await Todos.find();
    const todos = await result.toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function findOne(
  //request takes in paramsDictionary, ResBody, ReqBody
  req: Request<ParamsWithId, TodoWithId, {}>,
  res: Response<TodoWithId>,
  next: NextFunction
) {
  console.log("findOne route handler invoked");
  try {
    const result = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      res.status(404);
      throw new Error(`Todo with id ${req.params.id} not found`);
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) {
  try {
    const insertResult: InsertOneResult<TodoWithId> = await Todos.insertOne(
      req.body
    );
    if (!insertResult.acknowledged) {
      throw new Error("Insertion failed");
    }
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...req.body,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOne(
  req: Request<ParamsWithId, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) {
  console.log("updateOne route handler invoked");
  try {
    const result = await Todos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
      }
    );

    if (!result) {
    
      res.status(404);
      throw new Error(`Todo with id ${req.params.id} not found`);
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) {
  console.log("deleteOne route handler invoked");
  try {
    const result = await Todos.findOneAndDelete({
      _id: new ObjectId(req.params.id)
    });
    console.log("result is:", result);

    if (!result) {
      const error = new Error(`Todo with id ${req.params.id} not found`);
     res.status(404);
      throw error;
      // Send the response immediately after setting the status code
    }
    return res.status(204).end(); // Respond with 204 status code (No Content)
  } catch (error) {
    next(error);
  }
}
