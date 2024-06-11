import { MongoClient, ObjectId, Db } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

let singleton: Db | null = null;

interface User {
  name: string;
  password: string;
  role: string;
}

interface Book {
  name: string;
  author: string;
  publishedDate: string;
}

async function connect() {
  if (singleton) return singleton;

  if (!process.env.MONGO_HOST || !process.env.MONGO_DATABASE) {
    throw new Error("Missing MongoDB configuration in environment variables");
  }

  const client = new MongoClient(process.env.MONGO_HOST);
  await client.connect();

  singleton = client.db(process.env.MONGO_DATABASE);
  return singleton;
}

async function insertBook(book: Book): Promise<void> {
  const db = await connect();
  await db.collection("books").insertOne(book);
}

async function findBook(bookName: string): Promise<Book[]> {
  const db = await connect();
  return db.collection<Book>("books").find({ name: bookName }).toArray();
}

async function getAllBooks(): Promise<Book[]> {
  const db = await connect();
  return db.collection<Book>("books").find().toArray();
}

async function removeBook(id: string): Promise<void> {
  const db = await connect();
  await db.collection("books").deleteOne({ _id: new ObjectId(id) });
}

async function updateBook(id: string, book: Partial<Book>): Promise<void> {
  const db = await connect();
  await db
    .collection("books")
    .updateOne({ _id: new ObjectId(id) }, { $set: book });
}

async function insertUser(user: User): Promise<void> {
  const db = await connect();
  await db.collection("users").insertOne(user);
}

async function findUser(userName: string): Promise<User[]> {
  const db = await connect();
  return db.collection<User>("users").find({ name: userName }).toArray();
}

async function getAllUsers(): Promise<User[]> {
  const db = await connect();
  return db.collection<User>("users").find().toArray();
}

async function removeUser(id: string): Promise<void> {
  const db = await connect();
  await db.collection("users").deleteOne({ _id: new ObjectId(id) });
}

async function updateUser(id: string, user: Partial<User>): Promise<void> {
  const db = await connect();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: user });
}

export default {
  insertBook,
  findBook,
  getAllBooks,
  removeBook,
  updateBook,
  insertUser,
  findUser,
  getAllUsers,
  removeUser,
  updateUser,
};
