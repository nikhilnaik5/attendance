const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const holidays = require('./holiday')
const extras = require('./extra')

const subjSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    sunday:{
        type: Number,
        require: true,
        default: 0
    },
    monday:{
        type: Number,
        require: true,
        default: 0
    },
    tuesday:{
        type: Number,
        require: true,
        default: 0
    },
    wednesday:{
        type: Number,
        require: true,
        default: 0
    },
    thursday:{
        type: Number,
        require: true,
        default: 0
    },
    friday:{
        type: Number,
        require: true,
        default: 0
    },
    saturday:{
        type: Number,
        require: true,
        default: 0
    },
    start:{
        type: Date,
        require: true
    },
    end:{
        type: Date,
        require: true
    },
    extra: [{
        type: Schema.Types.ObjectId,
        ref: 'Extra'
    }],
    holiday: [{
        type: Schema.Types.ObjectId,
        ref: 'Holiday'
    }]
});

const Subject = mongoose.model('Subject', subjSchema);

module.exports = Subject;