const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const deviceSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
module.exports = mongoose.model('device', deviceSchema)
