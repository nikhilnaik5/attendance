const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const NewsSchema = new Schema({
    date:{
        type:Date,
        require: true
    },
    topic:{
        type: String,
        require: true
    }
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;