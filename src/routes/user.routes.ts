import { Request, Response, Router } from "express";
import userController from "../controllers/user.controller";

const usersRoute = Router();

usersRoute.get("/users", (req: Request, res: Response) =>
  userController.getUsers(req, res)
);

usersRoute.get("/users/:name", (req: Request, res: Response) =>
  userController.findUser(req, res)
);

usersRoute.post(
  "/users",
  userController.validateUser(),
  (req: Request, res: Response) => userController.createUser(req, res)
);

usersRoute.put("/users/:id", (req: Request, res: Response) =>
  userController.updateUser(req, res)
);

usersRoute.delete("/users/:id", (req: Request, res: Response) =>
  userController.removeUser(req, res)
);

export default usersRoute;
