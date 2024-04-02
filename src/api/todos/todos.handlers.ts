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
    console.log(result);
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
