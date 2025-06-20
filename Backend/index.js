import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/index.js"; 

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get("/boards", async (req, res) => {
  const{category, author} =req.query;

  const filters={}
  if (category){
    filters.category=category;
  }
  if (author){
    filters.author=author;
  }

  
  try {
    const boards = await prisma.board.findMany({
      where: filters,
      include: { cards: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

app.get("/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);
  try {
    const newboard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { cards: true },
    });

    if (!newboard) return res.status(404).json({ error: "Board not found" });
    res.json(newboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to get board" });
  }
});


app.post("/boards", async (req, res) => {
  const { title, category, author } = req.body;

  try {
    const board = await prisma.board.create({
      data: 
      { 
        title,
        category,
        author 
      },
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to create board" });
  }
});


app.delete("/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);
  try {
    const deleted = await prisma.board.delete({
      where: { id: boardId },
    });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete board" });
  }
});


app.get("/cards/:id", async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to get card" });
  }
});

app.post("/cards", async (req, res) => {
  const { message, gifUrl, author, boardId } = req.body;
  try {
    const card = await prisma.card.create({
      data: {
        message,
        gifUrl,
        author,
        board: { connect: { id: boardId } },
      },
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

app.delete("/cards/:id", async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    const deleted = await prisma.card.delete({
      where: { id: cardId },
    });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete card" });
  }
});


app.patch("/cards/:id/upvote", async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    const updated = await prisma.card.update({
      where: { id: cardId },
      data: { upvotes: { increment: 1 } },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote card" });
  }
});

app.post('/comments', async (req, res) =>{
  const { cardId, text, author} =req.body;
  if (!text || !cardId) return res.status(400).json({ error: 'Text required and please specify the card'});

  const comment =await prisma.comment.create({
    data:{text, author, cardId: parseInt(cardId)}
  });
  res.json(comment);
});

app.get("/comments/:cardId", async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  const comments = await prisma.comment.findMany({
      where: {  cardId },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
