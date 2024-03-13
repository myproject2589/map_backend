export { };
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const tokenSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },

    },
    {
        // strict: true,
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("token", tokenSchema);
