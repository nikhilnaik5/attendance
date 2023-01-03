const express = require('express');
const router = express.Router();

const Subject = require('../model/subject');
const Holiday = require('../model/holiday');
const Extra = require('../model/extra');
const User = require('../model/userSchema');
const Absent = require('../model/absent');
const passport = require('passport');
const jwt = require('jsonwebtoken');

require('../config/passjwt');

router.get('/',passport.authenticate('jwt',{session:false}), async (req, res) => {
    let user = req.user;
    user = await User.findOne({ _id: user });
    let later = user;
    user = user.subjects;

    let schedule = [];
    let subject = await Subject.findOne({ _id: user[0] });
    let start = subject.start;
    let finish = subject.end;
    let subjectweek = [];

    var loop = start;
    while (loop.getTime() <= finish.getTime()) {
        var day = (new Date(loop.getTime())).toJSON();
        subjectweek = [];
        subjectweek.push(day);
        schedule.push(subjectweek);
        loop.setTime(loop.getTime() + 1000 * 60 * 60 * 24);
    }
    subjectweek = [];
    subjectweek.push("DATE");
    for (var r = 0; r < user.length; r++) {
        let subject = await Subject.findOne({ _id: user[r] });
        let start = subject.start;
        let finish = subject.end;
        subjectweek.push(subject.name);
        let temp=[];
        let days = 0;

        for (var i = 0; i < schedule.length; i++) {
            let date = new Date(schedule[i][0]);
            day = date.getDay();
            temp=[];
            if (day == 1 && subject.monday != 0) {
                days += subject.monday
            }
            else if (day == 2 && subject.tuesday != 0) {
                days += subject.tuesday;
            }
            else if (day == 3 && subject.wednesday != 0) {
                days += subject.wednesday;
            }
            else if (day == 4 && subject.thursday != 0) {
                days += subject.thursday;
            }
            else if (day == 5 && subject.friday != 0) {
                days += subject.friday;
            }
            else if (day == 6 && subject.saturday != 0) {
                days += subject.saturday;
            }
            else if (day == 0 && subject.sunday != 0) {
                days += subject.sunday;
            }
            temp.push(days);
            temp.push(days);
            temp.push(0);
            schedule[i].push(temp);
        }

        for (var i = 0; i < subject.extra.length; i++) {
            let extraDay = await Extra.findOne({ _id: subject.extra[i] });
            let day = 0;
            let extra=0;
            if (extraDay) {
                day = new Date(extraDay.date)
                for (var k = 0; k < schedule.length; k++) {
                    extra = new Date(schedule[k][0])
                    if (day.getTime() == extra.getTime()) {
                        for (var j = k; j < schedule.length; j++) {
                            schedule[j][r+1][0]+=extraDay.number;
                            schedule[j][r+1][1]+=extraDay.number;
                        }
                    }
                }
            }
        }

        for (var i = 0; i < subject.holiday.length; i++) {
            let extraDay = await Holiday.findOne({ _id: subject.holiday[i] });
            let day = 0;
            let extra=0;
            if (extraDay) {
                day = new Date(extraDay.date)
                for (var k = 0; k < schedule.length; k++) {
                    extra = new Date(schedule[k][0])
                    if (day.getTime() == extra.getTime()) {
                        for (var j = k; j < schedule.length; j++) {
                            schedule[j][r+1][0]-=extraDay.number;
                            schedule[j][r+1][1]-=extraDay.number;
                        }
                    }
                }
            }
        }
    }
    schedule.unshift(subjectweek);

    user= later;
    for(var i=0;i<user.absent.length;i++)
    {
        let absent = await Absent.findOne({_id:user.absent[i]});
        let subject = await Subject.findOne({_id:absent.subjects});
        let j=0;
        for(j=1;j<schedule[0].length;j++)
        {
            if(schedule[0][j]==subject.name)
            {
                break;
            }
        }
        
        for (var k = 1; k < schedule.length; k++) {
            let date = schedule[k][0];
            date = new Date(date);
            let compare = absent.date;
            compare = new Date(compare);
            if (compare.getTime() == date.getTime()) {
                schedule[k][j][2]=-1;
                for (var x = k; x < schedule.length; x++) {
                    schedule[x][j][0] -= absent.number;
                }
            }
        }
    }
    let output=[];
    output.push(schedule);
    res.status(200).send(output);
});


router.post('/addsubject', async (req, res) => {
    const { name, start, end, monday, tuesday, wednesday, thursday, friday } = req.body;
    const subject = new Subject({ name, start, end, monday, tuesday, wednesday, thursday, friday })
    if (await subject.save()) {
        res.status(200).send("Successfully added a subject");
    }
    else {
        res.status(500).send("An error occured while adding a subject");
    }
});

router.post('/addextra', async (req, res) => {
    let date = new Date(req.body.date);
    date = new Date(date.getTime() + date.getTimezoneOffset() * -60000)
    const subject = req.body.subject;
    const extralecture = new Extra({ date });
    for (var i = 0; i < subject.length; i++) {
        let sub = await Subject.findOne({ "name": subject[i] });
        extralecture.subjects.push(sub);
    }
    const extraSave = await extralecture.save();
    for (var i = 0; i < subject.length; i++) {
        let sub = await Subject.findOne({ "name": subject[i] });
        sub.extra.push(extraSave);
        await sub.save();
    }
    res.status(200).send("Successfully added a extra lecture");
})

router.post('/addholiday', async (req, res) => {
    let date = new Date(req.body.date);
    date = new Date(date.getTime() + date.getTimezoneOffset() * -60000)
    const subject = req.body.subject;
    const holiday = new Holiday({ date });
    for (var i = 0; i < subject.length; i++) {
        let sub = await Subject.findOne({ "name": subject[i] });
        holiday.subjects.push(sub);
    }
    const holidaySave = await holiday.save();
    for (var i = 0; i < subject.length; i++) {
        let sub = await Subject.findOne({ "name": subject[i] });
        sub.holiday.push(holidaySave);
        await sub.save();
    }
    res.status(200).send("Successfully added a holiday");
})

router.post('/enrollcourse',passport.authenticate('jwt',{session:false}), async (req, res) => {
    const subj = req.body.subject;
    const id = req.user;
    for (var i = 0; i < subj.length; i++) {
        var sub = await Subject.findOne({ name: subj[i] })
        var user = await User.findOne({ _id: id })
        user.subjects.push(sub);
        await user.save();
    }
    res.status(200).send("Successfully enrolled to the course");
})

router.post('/absent',passport.authenticate('jwt',{session:false}), async (req, res) => {
    const subj = req.body.subject;
    const id = req.user;
    const number= req.body.number;
    let date = new Date(req.body.date)
    date = new Date(date.getTime() + date.getTimezoneOffset() * -60000)

    const student = await User.findOne({ _id: id });
    const subject = await Subject.findOne({ name: subj });

    const absent = new Absent({ student: student, subjects: subject, date: date,number:number });
    await absent.save();

    student.absent.push(absent);
    await student.save();
    if (await absent.save()) {
        res.status(200).send("Successfully marked you absent");
    }
    else {
        res.status(500).send("An error occured while marking you absent");
    }

})

router.post('/sub',passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log(req.body);
    console.log(req.user.name);
    const sub = req.body.subject;
    const subject = await Subject.findOne({name:sub});
    let start = new Date(subject.start);
    let end = new Date(subject.end);
    let schedule = [];
    let temp = [];
    while(start.getTime()<=end.getTime())
    {
        let day = start.getDay();
        temp = [];
        if(day == 0 && subject.sunday!=0)
        {
            temp.push(new Date(start));
            temp.push(subject.sunday);
            schedule.push(temp);
        }
        else if(day == 1 && subject.monday!=0)
        {
            temp.push(new Date(start));
            temp.push(subject.monday);
            schedule.push(temp);
        }
        else if(day == 2 && subject.tuesday!=0)
        {
            temp.push(new Date(start));
            temp.push(subject.tuesday);
            schedule.push(temp);
        }
        else if(day == 3 && subject.wednesday!=0)
        {
            temp.push(new Date(start));
            temp.push(subject.wednesday);
            schedule.push(temp);
        }
        else if(day == 4 && subject.thursday!=0)
        {
            temp.push(new Date(start));
            temp.push(subject.thursday);
            schedule.push(temp);
        }
        else if(day == 5 && subject.friday!=0)
        {
            
            temp.push(new Date(start));
            temp.push(subject.friday);
            schedule.push(temp);
        }
        else if(day == 6 && subject.saturday!=0)
        {
            temp.push(new Date(start));
            temp.push(subject.saturday);
            schedule.push(temp);
        }
        start.setTime(start.getTime() + 1000 * 60 * 60 * 24);
    }
    for(var i=0;i<subject.extra.length;i++)
    {
        let extra = await Extra.findOne({_id:subject.extra[i]});
        let date = new Date(extra.date);
        for(var j=0;j<schedule.length;j++)
        {
            let c = new Date(schedule[j][0]);
            if(date.getTime()==c.getTime())
            {
                schedule[j][1] = schedule[j][1] + extra.number;
                break;
            }
            else if(date.getTime()>c.getTime())
            {
                let temp = [];
                temp.push(date);
                temp.push(extra.number);
                schedule.splice(j+1,0,temp);
                // console.log("Wassup");
                break;
            }
        }
    }
    for(var i=0;i<subject.holiday.length;i++)
    {
        let holiday = await Holiday.findOne({_id:subject.holiday[i]});
        let date = new Date(holiday.date);
        for(var j=0;j<schedule.length;j++)
        {
            let c = new Date(schedule[j][0]);
            if(date.getTime()==c.getTime())
            {
                schedule[j][1] = schedule[j][1] - holiday.number;
                if(schedule[j][1]==0)
                {
                    schedule.splice(j,1);
                }
                break;
            }
        }
    }
    for(var i=0;i<schedule.length;i++)
    {
        schedule[i].push(schedule[i][1]);
        schedule[i].push(0);
    }
    for(var i=0;i<req.user.absent.length;i++)
    {
        let absent = await Absent.findOne({_id:req.user.absent[i]});
        let date = new Date(absent.date)
        for(var j=0;j<schedule.length;j++)
        {
            let c = new Date(schedule[j][0]);
            if(date.getTime()==c.getTime())
            {
                schedule[j][2]=schedule[j][2]-absent.number;
                schedule[j][3]=-1;
                break;
            }
        }
    }
    let lectures =0;
    let attended = 0;
    for(var i=0;i<schedule.length;i++)
    {
        lectures+=schedule[i][1];
        attended+=schedule[i][2];
        schedule[i].push(lectures);
        schedule[i].push(attended);
        schedule[i].push(((attended/lectures)*100).toFixed(2));
    }
    
    res.status(200).send(schedule);
})

router.get('/getsubjectnames',passport.authenticate('jwt',{session:false}), async (req, res) => {
    let user = await User.findOne({_id:req.user._id});
    let subjects= [];
    for(var i=0;i<user.subjects.length;i++)
    {
        let sub = await Subject.findOne({_id:user.subjects[i]});
        subjects.push(sub.name);
    }
    res.status(200).send(subjects);
})

module.exports = router;