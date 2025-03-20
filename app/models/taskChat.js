const mongoose = require('mongoose');

// Broadcast task content schema-
const TaskChatSchema = new mongoose.Schema(
    {
        task_id: {
            type: mongoose.Types.ObjectId,
            ref: 'BroadcastTask'
        },
        mediahouse_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        sender_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        receiver_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        content: [],
        message_type: {
            type: String,
            enum: [
                "Hopper_Uploaded_Content",
            ]
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
module.exports = mongoose.model("TaskChat", TaskChatSchema);
