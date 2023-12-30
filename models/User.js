const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
)

const User = model(`User`, UserSchema)

module.exports = User
