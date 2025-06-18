// const express = require('express');
// const cors = require("cors");
// const app = express();

// const { PrismaClient } = require('./generated/prisma');
// const prisma = new PrismaClient();

// app.use(express.json());
// app.use(cors());

// const boardRoutes= require('./routes/boardRoutes');
// const cardRoutes = require('./routes/cardRoutes');

// app.use('/boards', boardRoutes);
// app.use('/cards', cardRoutes);

// app.get('/', (req, res)=>{
//   res.send('API NOT WORKING');
// });

// // app.get('/boards', async (req, res) => {
// //   try {
// //     const boards = await prisma.board.findMany({
// //       // include: { cards: true },
// //       orderBy: { createdAt: 'desc' }
// //     });
// //     res.json(boards);
// //   } catch (err) {
// //     logError(err);
// //     res.status(500).json({ error: 'Failed to fetch boards' });
// //   }
// // });

// // // Create new board
// // app.post('/boards', async (req, res) => {
// //   const { title, category, author } = req.body;
// //   try {
// //     const newBoard = await prisma.board.create({
// //       data: {
// //         title,
// //         category,
// //         author
// //       }
// //     });
// //     res.json(newBoard);
// //   } catch (err) {
// //     logError(err);
// //     res.status(500).json({ error: 'Failed to create board' });
// //   }
// // });

// // // Delete a board
// // app.delete('/boards/:id', async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     const deleted = await prisma.board.delete({
// //       where: { id: parseInt(id) }
// //     });
// //     res.json(deleted);
// //   } catch (err) {
// //     logError(err);
// //     res.status(500).json({ error: 'Failed to delete board' });
// //   }
// // });

// const PORT = process.env.PORT||3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/index.js"; //error

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  try {
    res.json('base')
    console.log('base')
    res.send('✅ Backend is working!')
    // Remove this line, as you can only send one response per request
    // res.send('✅ Backend is working!')
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
});

app.get("/boards", async (req, res) => {
  // const{category, autor} =req.query;

  // const filters={}
  

  try {
    const boards = await prisma.board.findMany({
      include: { cards: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

// Get one board by ID
app.get("/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);
  try {
    const Newboard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { cards: true },
    });

    if (!Newboard) return res.status(404).json({ error: "Board not found" });
    res.json(Newboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to get board" });
  }
});

// Create a board
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

// Delete a board
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

// Create a card
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

// Delete a card
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

// Upvote a card
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
