import mongoose from 'mongoose'

const DataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    photo: {
      type: Buffer,
      required: true
    },
    descriptor: {
      type: Array,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Data = mongoose.model('Data', DataSchema)
export default Data
