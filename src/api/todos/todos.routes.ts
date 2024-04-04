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
router.put(
    '/:id',
validateRequest({
    params: ParamsWithId,
    body: Todo,
}),
TodoHandlers.updateOne
);

router.delete(
    '/:id',
    validateRequest({
        params: ParamsWithId,
    }),
    TodoHandlers.deleteOne
 
)

export default router;
