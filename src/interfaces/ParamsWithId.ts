import * as z from "zod";
import { ObjectId } from "mongodb";

export const ParamsWithId = z.object({
  id: z
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          return new ObjectId(val);
        } catch (error) {
          return false;
        }
      },
      {
        message: "Invalide ObjectId",
      }
    ),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
