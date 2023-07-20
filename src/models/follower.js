// Init code
const mongoose = require("mongoose");

const followerSchema = mongoose.Schema(
    {
        follow_id: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        follower_id: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Module exports
module.exports = mongoose.model("followers", followerSchema);
