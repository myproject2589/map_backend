export { };
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const addressSchema = new Schema(
    {
        address1: {
            type: String,
            required: true,
        },
        address2: {
            type: String,
        },
        // area: {
        //     type: String,
        //     required: true,
        // },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zip: {
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

module.exports = mongoose.model("address", addressSchema);
