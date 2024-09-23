const express = require('express')
const { Router } = require("express");
const userRouter = Router();
const { UserModel, PurchaseModel, CourseModel } = require('../db')
const bcrypt = require('bcrypt')
const { jwt, userAuth, JWT_USER_SECRET } = require('../auth')
const { z } = require('zod')


userRouter.post("/signup", async function (req, res) {

  const requiredBody = z.object({
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(100)
  })

  const parsedCorrectly = requiredBody.safeParse(req.body)

  if (!parsedCorrectly.success) {
    res.status(400).json({
      message: "wrong format of input"
    })
    return;
  }
  const { firstName, lastName, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 5)
  console.log(`password hashed for ${firstName}`)
  try {
    await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
    })
  } catch (e) {
    console.error("error in user Signup", e)
    return;
  }
  res.json({
    message: "you are signed up"
  })
})

userRouter.post("/signin", async function (req, res) {

  const { email, password } = req.body
  const user = await UserModel.findOne({
    email: email,
  })

  if (!user) {
    res.status(403).json({
      message: "user does not exist"
    })
    return
  }

  const passwordMatched = await bcrypt.compare(password, user.password)

  if (passwordMatched) {
    const token = jwt.sign({
      id: user._id.toString()
    }, JWT_USER_SECRET)
    res.json({
      token: token
    })
  } else {
    res.status(403).json({
      message: "incorrect creds"
    })
  }

})

userRouter.get("/purchases", userAuth, async function (req, res) {
  const userId = req.userId;
  let purchases;
  try {
    purchases = await PurchaseModel.find({
      userId
    })
  } catch (e) {
    console.error(e)
  }
  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId)
  }
  const courseData = await CourseModel.find({
    _id: { $in: purchasedCourseIds }
  })

  res.json({
    purchases,
    courseData
  })
})

module.exports = {
  userRouter: userRouter
}
