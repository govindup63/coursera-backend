const { Schema, ObjectId } = require('mongoose')
const mongoose = require('mongoose')
const usersSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String
})

const admingSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String
})

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId
})

const purchaseSchema = new Schema({
  userId: { type: ObjectId, required: true, ref: 'User' },
  courseId: { type: ObjectId, required: true, ref: 'Course' }
}, {
  timestamps: true
});

// Create a compound index to ensure uniqueness across (userId, courseId)
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserModel = mongoose.model('users', usersSchema)
const AdminModel = mongoose.model('admin', admingSchema)
const CourseModel = mongoose.model('course', courseSchema)
const PurchaseModel = mongoose.model('purchase', purchaseSchema)

module.exports = {
  UserModel: UserModel,
  AdminModel: AdminModel,
  CourseModel: CourseModel,
  PurchaseModel: PurchaseModel
}
