
import * as z from 'zod';
import { db } from '../../db';
import { WithId, Collection} from 'mongodb'; 

// Define your Mongoose schema
// Define your Zod schema for Todo
export const Todo = z.object({
  content: z.string().min(1),
  done: z.boolean().default(false),
});



export type Todo = z.infer<typeof Todo>;
export type TodoWithId = WithId<Todo>;


export const Todos = db.collection('todos');