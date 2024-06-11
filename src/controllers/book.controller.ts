import { Request, Response } from "express";
import db from "../../db";
import * as dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

interface Book {
  name: string;
  author: string;
  publishedDate: string;
}

class BookController {
  validateBook() {
    return [
      body("name").isString().notEmpty(),
      body("author").isString().notEmpty(),
      body("publishedDate").isString().notEmpty(),
    ];
  }

  async createBook(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      await db.insertBook(req.body);
      res.status(201).json({ message: "Livro cadastrado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao cadastrar livro!" });
    }
  }

  async getBooks(req: Request, res: Response): Promise<void> {
    try {
      const result = await db.getAllBooks();
      res
        .status(201)
        .json({ message: "Busca feita com sucesso!", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar busca!" });
    }
  }

  async findBook(req: Request, res: Response): Promise<void> {
    try {
      const name = req.params.name;

      if (typeof name !== "string") {
        res.status(400).json({ errors: "Busca inválida!" });
      } else {
        const result = await db.findBook(name);
        res
          .status(201)
          .json({ message: "Busca feita com sucesso!", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar busca!" });
    }
  }

  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ errors: "Ação inválida!" });
      } else {
        const result = await db.updateBook(id, req.body);
        res
          .status(201)
          .json({ message: "Atualização feita com sucesso!", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar atualização!" });
    }
  }

  async removeBook(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ errors: "Ação inválida!" });
      } else {
        const result = await db.removeBook(id);
        res
          .status(201)
          .json({ message: "Remoção feita com sucesso!", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar remoção!" });
    }
  }
}

export default new BookController();
