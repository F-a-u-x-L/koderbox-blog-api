const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Blog', BlogSchema);