const { Router } = require("express");
const express = require('express')
const courseRouter = Router();
const { CourseModel, PurchaseModel } = require('../db')
const { userAuth } = require('../auth.js')
const { z } = require('zod')

courseRouter.post("/purchase", userAuth, async function (req, res) {
  const requiredBody = z.object({
    courseId: z.string().refine((val) => /^[a-fA-F0-9]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    })
  });

  const parsedCorrectly = requiredBody.safeParse(req.body);

  if (!parsedCorrectly.success) {
    console.error("Validation errors:", parsedCorrectly.error.format());
    res.status(400).json({
      message: "wrong format of input",
      errors: parsedCorrectly.error.flatten(), // Optional: Send detailed errors
    });
    return;
  }
  // you would expect the user to pay you money
  const userId = req.userId
  const courseId = req.body.courseId;
  let isPaid = true;
  if (isPaid) {
    try {
      await PurchaseModel.create({
        userId: userId,
        courseId: courseId
      })
    } catch (e) {
      res.status(500).json({
        message: "error creating course : " + e
      })
      return
    }
    res.json(`course purchased with course id : ${courseId}`)
  } else {
    res.json({
      message: "you havent paid for the course"
    })
  }
})

courseRouter.get("/preview", async function (req, res) {
  let courses
  try {
    courses = await CourseModel.find()
  } catch (e) {
    res.status(400).json({
      message: "error fetching courses"
    })
  }
  res.json({
    courses
  })

})
module.exports = {
  courseRouter: courseRouter
}
