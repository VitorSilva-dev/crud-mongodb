import { Request, Response } from "express";
import { createHash } from "node:crypto";
import db from "../../db";
import * as dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

interface User {
  id?: string;
  name: string;
  password: string;
  role: string;
}

class UserController {
  hashString(value: string): string {
    const hash = createHash("sha256");
    hash.update(value + process.env.SECRETPEPPER);

    return hash.digest("hex");
  }

  validateUser() {
    return [
      body("name").isString().notEmpty(),
      body("password").isString().isLength({ min: 6 }),
      body("role").isString().notEmpty(),
    ];
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { name, password, role }: User = req.body;
    const hashedPassword = this.hashString(password);

    const user: User = {
      name,
      password: hashedPassword,
      role,
    };

    try {
      await db.insertUser(user);
      res.status(201).json({ message: "Usuario cadastrado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao cadastrar usuario!" });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await db.getAllUsers();
      res
        .status(201)
        .json({ message: "Busca feita com sucesso!", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar busca!" });
    }
  }

  async findUser(req: Request, res: Response): Promise<void> {
    try {
      const name = req.params.name;

      if (typeof name !== "string") {
        res.status(400).json({ errors: "Busca inválida!" });
      } else {
        const result = await db.findUser(name);
        res
          .status(201)
          .json({ message: "Busca feita com sucesso!", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar busca!" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ errors: "Ação inválida!" });
      } else {
        const result = await db.updateUser(id, req.body);
        res
          .status(201)
          .json({ message: "Remoção feita com sucesso!", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar remoção!" });
    }
  }

  async removeUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ errors: "Ação inválida!" });
      } else {
        const result = await db.removeUser(id);
        res
          .status(201)
          .json({ message: "Atualização feita com sucesso!", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao realizar atualização!" });
    }
  }
}

export default new UserController();
