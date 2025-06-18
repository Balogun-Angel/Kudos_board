// const express = require('express');
// const router = express.Router();

// const { PrismaClient } = require('./generated/prisma');
// const prisma = new PrismaClient();


// router.post('/', async (req, res) => {
// const { message, gifUrl, author, boardId } = req.body;

// try {
// const card = await prisma.card.create({
// data: {
// message,
// gifUrl,
// author,
// board: { connect: { id: boardId } },
// },
// });
// res.status(201).json(card);
// } catch (err) {
// res.status(500).json({ error: 'Failed to create card' });
// }
// });

// router.delete('/:id', async (req, res) => {
// const cardId = parseInt(req.params.id);

// try {
// const deleted = await prisma.card.delete({
// where: { id: cardId },
// });
// res.json(deleted);
// } catch (err) {
// res.status(500).json({ error: 'Failed to delete card' });
// }
// });

// //to upvote
// router.patch('/:id/upvote', async (req, res) => {
// const cardId = parseInt(req.params.id);

// try {
// const updated = await prisma.card.update({
// where: { id: cardId },
// data: { upvotes: { increment: 1 } },
// });
// res.json(updated);
// } catch (err) {
// res.status(500).json({ error: 'Failed to upvote card' });
// }
// });

// module.exports = router;
