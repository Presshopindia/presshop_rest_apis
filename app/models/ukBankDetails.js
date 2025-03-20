const mongoose = require('mongoose')

// Define the schema
const BankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      // required: true,
      trim: true
    },

    logoUrl: {
      type: String,
      // required: true,
      trim: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'bankNameUK'
  }
)

// Create the model
const UkBank = mongoose.model('UkBank', BankSchema)

module.exports = UkBank
