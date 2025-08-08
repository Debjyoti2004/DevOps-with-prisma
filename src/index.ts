import express from "express"
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();


app.use(express.json());

app.get("/",async (req, res) => {
    const user = await prisma.user.findMany();
    res.json(user);
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
});


app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user && user.password === password) {
      res.status(200).json({ message: "Sign in successful", user });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "An error occurred while signing in." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});