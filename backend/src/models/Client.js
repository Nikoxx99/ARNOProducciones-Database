import { Schema, model } from 'mongoose'

const clientSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  dni: {
    type: String,
  },
  address: {
    type: String,
  },
  neighborhood: {
    type: Number,
  },
  city: {
    type: Number
  },
  phone: String,
  plan: Number,
  wifi_ssid: String,
  wifi_password: String,
  technology: Number,
  mac_address: String,
  comment: String,
  created_at: Date,
  updated_at: {
    type: Date
  },
  operator: Number,
  newModel: {
    type: Number,
    defualt: 1
  }
})

export default model('Client', clientSchema)