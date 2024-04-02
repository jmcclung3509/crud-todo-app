import { Router } from "express";
import * as TodoHandlers from "./todos.handlers";
import { Todo } from "./todos.model";
import { validateRequest } from "../../middlewares";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get("/", TodoHandlers.findAll);

router.get(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  TodoHandlers.findOne
);

router.post(
  "/",
  validateRequest({
    body: Todo,
  }),
  TodoHandlers.createOne
);

export default router;
