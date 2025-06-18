const express = require('express')
const app = express()
app.use(express.json());

const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

//test conment