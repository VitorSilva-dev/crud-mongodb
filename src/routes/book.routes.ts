import { Request, Response, Router } from "express";
import bookController from "../controllers/book.controller";

const booksRoute = Router();

booksRoute.get("/books", (req: Request, res: Response) =>
  bookController.getBooks(req, res)
);

booksRoute.get("/books/:name", (req: Request, res: Response) =>
  bookController.findBook(req, res)
);

booksRoute.post(
  "/books",
  bookController.validateBook(),
  (req: Request, res: Response) => bookController.createBook(req, res)
);

booksRoute.put("/books/:id", (req: Request, res: Response) =>
  bookController.updateBook(req, res)
);

booksRoute.delete("/books/:id", (req: Request, res: Response) =>
  bookController.removeBook(req, res)
);

export default booksRoute;
