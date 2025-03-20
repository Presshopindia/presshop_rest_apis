const mongoose = require('mongoose');

// Broadcast task schema-
const BroadcastTaskSchema = new mongoose.Schema(
    {
        mediahouse_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        medihouse_user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        deadline_date: {
            type: Date
        },
        heading: {
            type: String
        },
        description: {
            type: String
        },
        any_spcl_req: {
            type: String
        },
        location: {
            type: String
        },
        address_location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number]
            }
        },
        category_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Category'
        },
        media_type: {
            photo: {
                type: Boolean,
                default: false
            },
            video: {
                type: Boolean,
                default: false
            },
            interview: {
                type: Boolean,
                default: false
            },
        },
        price: {
            mediahouse_photo: {
                type: Number,
                default: 0
            },
            mediahouse_video: {
                type: Number,
                default: 0
            },
            mediahouse_interview: {
                type: Number,
                default: 0
            },
            hopper_photo: {
                type: Number,
                default: 0
            },
            hopper_video: {
                type: Number,
                default: 0
            },
            hopper_interview: {
                type: Number,
                default: 0
            },
        },
        notified_hoppers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        accepted_hoppers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        task_completed_hoppers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        admin_assigned_hoppers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true
        }
    }
)

// Export model -
module.exports = mongoose.model("BroadcastTask", BroadcastTaskSchema);
