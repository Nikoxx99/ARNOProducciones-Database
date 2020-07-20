import { Schema, model } from 'mongoose'

const citySchema = new Schema({
  id: Number,
  name: String,
  ip: String
})

export default model('City', citySchema)