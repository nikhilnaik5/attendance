const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Subject = require('./subject')

const extraSchema = new Schema({
    date:{
        type: Date,
        require: true
    },
    number:{
        type: Number,
        require: true
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }]
});

const Extra = mongoose.model('Extra', extraSchema);

module.exports = Extra;