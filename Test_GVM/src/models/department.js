// Init code
const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        employee_id: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Module exports
module.exports = mongoose.model("departments", departmentSchema);
