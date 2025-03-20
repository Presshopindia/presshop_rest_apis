const mongoose = require('mongoose')
const validator = require('validator')

const ChatBotSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: new Date().toISOString()
    },
    is_user: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('Chatbotmessage', ChatBotSchema)
