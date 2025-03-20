const mongoose = require('mongoose');

// Broadcast task content schema-
const BroadcastTaskContentSchema = new mongoose.Schema(
    {
        task_id: {
            type: mongoose.Types.ObjectId,
            ref: 'BroadcastTask'
        },
        hopper_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        mediahouse_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        medihouse_user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        time_stamp: {
            type: String,
            required: true
        },
        content: {
            media: {
                type: String,
                required: true
            },
            media_type: {
                type: String,
                required: true
            },
            watermark: {
                type: String
            },
            thumbnail: {
                type: String
            }
        },
        status: {
            type: String,
            enum: ['pending', 'published', 'rejected'],
            default: 'pending'
        },
        firstLevelCheck: {
            nudity: {
                type: Boolean,
                default: false
            },
            children: {
                type: Boolean,
                default: false
            },
            gdpr: {
                type: Boolean,
                default: false
            },
            deep_fake: {
                type: Boolean,
                default: false
            }
        },
        check_and_approve: {
            type: Boolean,
            default: false
        },
        remarks: {
            type: String
        },
        approved_by: {
            type: mongoose.Types.ObjectId,
            ref: 'Admin'
        }
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
module.exports = mongoose.model("TaskContent", BroadcastTaskContentSchema);
