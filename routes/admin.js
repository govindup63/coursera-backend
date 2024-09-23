const express = require('express')
const { Router } = require("express");
const adminRouter = Router();
const { AdminModel, CourseModel } = require("../db.js")
const bcrypt = require('bcrypt')
const { jwt, adminAuth, JWT_ADMIN_SECRET } = require('../auth.js')
const { z } = require('zod');


adminRouter.post("/signup", async function (req, res) {

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

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 5)
  console.log('admin password hashed for ' + firstName)

  try {
    await AdminModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
    })
  } catch (e) {
    console.error("error in admin signup  : ", e)
    return
  }
  res.json({
    message: "you are signed up as an admin"
  })

})

adminRouter.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  let admin;
  try {
    admin = await AdminModel.findOne({
      email: email
    })
  } catch (e) {
    res.status(404).json({
      message: "error finding admin"
    })
    return
  }
  if (!admin) {
    res.status(403).json({
      message: "user does not exist"
    })
    return
  }

  const passwordMatched = await bcrypt.compare(password, admin.password)

  if (passwordMatched) {
    const token = jwt.sign({
      id: admin._id.toString()
    }, JWT_ADMIN_SECRET)
    res.json({
      token: token
    })
  } else {
    res.status(403).json({
      message: "incorrect creds"
    })
  }

})

adminRouter.post("/course", adminAuth, async function (req, res) {

  const requiredBody = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(40).max(1000),
    price: z.number(),
    imageUrl: z.string(),
  })
  const parsedCorrectly = requiredBody.safeParse(req.body)
  if (!parsedCorrectly.success) {
    res.send(400).json({
      message: "wrong input format"
    })
    return
  }

  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const creatorId = req.userId;

  try {
    await CourseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: creatorId
    })
  } catch (e) {
    res.status(500).json({
      message: "error creating the course"
    })
    return
  }
  res.json({
    message: "course added succesfully"
  })

})

adminRouter.put("/course", adminAuth, async function (req, res) {
  const requiredBody = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(40).max(1000),
    price: z.number(),
    imageUrl: z.string(),
    courseId: z.string().refine((val) => /^[a-fA-F0-9]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    })
  })
  const parsedCorrectly = requiredBody.safeParse(req.body)
  if (!parsedCorrectly.success) {
    console.log("validation errors: ", parsedCorrectly.error.format())
    res.status(400).json({
      message: "wrong format of input"
    })
  }
  const creatorId = req.userId;
  const { title, description, imageUrl, price, courseId } = req.body
  let coursePut;
  try {
    coursePut = await CourseModel.updateOne({
      _id: courseId,
      creatorId: creatorId
    }, {
      title, description, price, imageUrl
    })
  } catch (e) {
    res.status(500).json({
      message: "error changing the course data: " + e
    })
    return
  }
  res.json({
    message: "data changed succesfully for courseId: " + courseId
  })
})

adminRouter.get("/course/bulk", adminAuth, async function (req, res) {
  const creatorId = req.userId
  let courses;
  try {
    courses = await CourseModel.find({
      creatorId: creatorId
    })
  } catch (e) {
    res.status(403).json({
      message: "error finding courses with for this creator"
    })
    return
  }
  res.json({
    courses
  })

})

module.exports = {
  adminRouter: adminRouter
}
