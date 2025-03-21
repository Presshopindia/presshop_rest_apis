const mongoose = require('mongoose')
const validator = require('validator')

const ChatSchema = new mongoose.Schema(
  {
    room_id: {
      type: String
    },
    message: {
      type: String
    },
    message_type: {
      type: String
    },
    sender_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'User'
    },
    imageCount: {
      type: String
    },
    videoCount: {
      type: String
    },
    audioCount: {
      type: String
    },
    content_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'contents'
    },
    transaction_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'HopperPayment'
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'User'
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'User'
    },
    receiver_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'User'
    },
    addedMsg: {
      type: String
    },
    image_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'Uploadcontent'
    },
    primary_room_id: {
      type: String
    },
    type: String,
    media: [
      {
        // add when message_type == 'media'
        watermarkimage_url: String,
        name: String,
        mime: String,
        size: String,
        url: String,
        status: {
          type: String,
          default: "pending"
        },
        thumbnail_path: String,
        thumbnail_url: String,
        amount: String,
        location: String,
        image_id: {
          type: mongoose.Types.ObjectId,
          ref: 'Uploadcontent'
        },
        paid_status: {
          type: Boolean,
          default: false
        },
      }
    ],
    content: [],
    rating: String,
    amount: String,
    sender_type: String,
    room_type: {
      type: String
    },
    paid_status: {
      type: Boolean,
      default: false
    },
    request_status: {
      type: Boolean,
      default: null
    },
    request_sent: {
      type: String,
      default: null
    },

    is_hide: {
      type: Boolean,
      default: null
    },
    user_info: Object,
    initial_offer_price: String,

    finaloffer_price: String,
    amount_paid: String,
    review: String,
    status: {
      type: String,
      // enum: ['active', 'inactive'],
      default: 'send'
    },
    features: Array,
    hopper_price: String,
    payable_to_hopper: String,
    views: String,
    purchase_count: String,
    presshop_commission: String,
    stripe_fee: String,
    earning: {
      type: String,
      default: ""
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('Chat', ChatSchema)
