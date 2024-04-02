import { Response, Request, NextFunction } from 'express';
import { Todo, Todos, TodoWithId } from './todos.model';
import { InsertOneResult } from 'mongodb';
import { ZodError } from 'zod';

export async function findAll(
  _req: Request,
  res: Response<TodoWithId[]>,
  next: NextFunction,
) {
  console.log('findAll route handler invoked');
  try {
    const result = await Todos.find();
    const todos = await result.toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction,
) {
  try {
    const validateResult = await Todo.parse(req.body);
    const insertResult: InsertOneResult<TodoWithId> = await Todos.insertOne(
      validateResult,
    );
    if (!insertResult.acknowledged) {
      throw new Error('Insertion failed');
    }
    res.json({
      _id: insertResult.insertedId,
      ...validateResult,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422);
    }
    next(error);
  }
}
