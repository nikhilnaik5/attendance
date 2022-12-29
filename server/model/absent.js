const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Subject = require('./subject');
const User = require('./userSchema');

const absenteeSchema = new Schema({
    date:{
        type: Date,
        require: true
    },
    number:{
        type: Number,
        require: true
    },
    student:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subjects: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }
});

const Absent = mongoose.model('Absent', absenteeSchema);

module.exports = Absent;