const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

// Log errors
const logError = (err) => {
  console.error(err);
};

app.get('/', (req, res)=>{
  res.send('API NOT WORKING');
});
// Get all boards
app.get('/boards', async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: { cards: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(boards);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// Create new board
app.post('/boards', async (req, res) => {
  const { title, category, author } = req.body;
  try {
    const newBoard = await prisma.board.create({
      data: { title, category, author }
    });
    res.json(newBoard);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// Delete a board
app.delete('/boards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.board.delete({
      where: { id: parseInt(id) }
    });
    res.json(deleted);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});