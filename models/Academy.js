const { Schema, model } = require('mongoose');

//Schema for lessons 
const lessonSchema = new Schema({
    title: String,
    vimeoLink: String, 
}, {
    timestamps: true
});

//Schema for modules
const moduleSchema = new Schema({
    name: String,
    lessons: [lessonSchema], // Embed lessons within modules as an array
}, {
    timestamps: true
});



module.exports = model('Modules', moduleSchema);
