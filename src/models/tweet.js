// Init code
const mongoose = require("mongoose");
const tweetSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Module exports
module.exports = mongoose.model("tweetes", tweetSchema);
