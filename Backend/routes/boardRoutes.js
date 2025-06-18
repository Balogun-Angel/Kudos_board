// const express = require('express');
// const router= express.Router();
// // const cors = require("cors");
// const { PrismaClient } = require('./generated/prisma');
// const prisma = new PrismaClient();

// // const app = express();



// // app.use(express.json());
// // app.use(cors());

// // Log errors
// // const logError = (err) => {
// //   console.error(err);
// // };

// // app.get('/', (req, res)=>{
// //   res.send('API NOT WORKING');
// // });
// // // Get all boards
// router.get('/', async (req, res) => {
//   try {
//     const boards = await prisma.board.findMany({
//       // include: { cards: true },
//       orderBy: { createdAt: 'desc' }
//     });
//     res.json(boards);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch boards' });
//   }
// });

// // Create new board
// router.post('/', async (req, res) => {
//   const { title, category, author } = req.body;
//   try {
//     const newBoard = await prisma.board.create({
//       data: { 
//         title, 
//         category, 
//         author 
//       }
//     });
//     res.json(newBoard);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create board' });
//   }
// });

// // Delete a board
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = await prisma.board.delete({
//       where: { id: parseInt(id) }
//     });
//     res.json(deleted);
//   } catch (err) {
//     logError(err);
//     res.status(500).json({ error: 'Failed to delete board' });
//   }
// });

// module.exports = router;