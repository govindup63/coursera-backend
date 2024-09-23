require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user.js')
const { courseRouter } = require('./routes/course.js')
const { adminRouter } = require('./routes/admin.js')

const app = express()
const PORT = 3000;

app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/course', courseRouter)
app.use('/api/v1/admin', adminRouter)

async function main() {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(PORT, () => {
    console.log(`port running on ${PORT}`)
  })
}
main()
