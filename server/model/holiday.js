const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Subject = require('./subject')

const holiSchema = new Schema({
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

const Holiday = mongoose.model('Holiday', holiSchema);

module.exports = Holiday;