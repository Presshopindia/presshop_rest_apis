const mongoose = require('mongoose')
const PrivacyPolicySchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    for: {
      type: String,
      enum: ['app', 'marketplace']
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
module.exports = mongoose.model('Privacy_policy', PrivacyPolicySchema)
