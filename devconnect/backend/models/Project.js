const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    techStack: {
        type: [String],
        default: []
    },

    githubLink: {
        type: String,
        default: ""
    },

    liveLink: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);