const express = require('express');
const router = express.Router();

const Subject = require('../model/subject');
const Holiday = require('../model/holiday');
const Extra = require('../model/extra');
const User = require('../model/userSchema');
const Absent = require('../model/absent');
const News = require('../model/news');

const passport = require('passport');
const jwt = require('jsonwebtoken');

require('../config/passjwt');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let user = req.user;
        user = await User.findOne({ _id: user });
        let later = user;
        user = user.subjects;

        let schedule = [];
        let subject = await Subject.findOne({ _id: user[0] });
        let start = subject.start;
        let finish = subject.end;
        let currDate = new Date();
        let subjectweek = [];

        var loop = start;
        while (loop.getTime() <= Math.min(finish.getTime(), currDate.getTime())) {
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
            let temp = [];
            let days = 0;

            for (var i = 0; i < schedule.length; i++) {
                let date = new Date(schedule[i][0]);
                day = date.getDay();
                temp = [];
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
                let extra = 0;
                if (extraDay) {
                    day = new Date(extraDay.date)
                    for (var k = 0; k < schedule.length; k++) {
                        extra = new Date(schedule[k][0])
                        if (day.getTime() == extra.getTime()) {
                            for (var j = k; j < schedule.length; j++) {
                                schedule[j][r + 1][0] += extraDay.number;
                                schedule[j][r + 1][1] += extraDay.number;
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < subject.holiday.length; i++) {
                let extraDay = await Holiday.findOne({ _id: subject.holiday[i] });
                let day = 0;
                let extra = 0;
                if (extraDay) {
                    day = new Date(extraDay.date)
                    for (var k = 0; k < schedule.length; k++) {
                        extra = new Date(schedule[k][0])
                        if (day.getTime() == extra.getTime()) {
                            for (var j = k; j < schedule.length; j++) {
                                schedule[j][r + 1][0] -= extraDay.number;
                                schedule[j][r + 1][1] -= extraDay.number;
                            }
                        }
                    }
                }
            }
        }
        schedule.unshift(subjectweek);

        user = later;
        for (var i = 0; i < user.absent.length; i++) {
            let absent = await Absent.findOne({ _id: user.absent[i] });
            let subject = await Subject.findOne({ _id: absent.subjects });
            let j = 0;
            for (j = 1; j < schedule[0].length; j++) {
                if (schedule[0][j] == subject.name) {
                    break;
                }
            }

            for (var k = 1; k < schedule.length; k++) {
                let date = schedule[k][0];
                date = new Date(date);
                let compare = absent.date;
                compare = new Date(compare);
                if (compare.getTime() == date.getTime()) {
                    schedule[k][j][2] = -1;
                    for (var x = k; x < schedule.length; x++) {
                        schedule[x][j][0] -= absent.number;
                    }
                }
            }
        }
        let output = [];
        output.push(schedule);
        res.status(200).send(output);
    }
    catch (err) {
        console.log(err);
        let output = [];
        res.status(200).send(output);
    }

});

router.post('/addsubject', async (req, res) => {
    try {
        let { name, start, end, monday, tuesday, wednesday, thursday, friday } = req.body;
        start = new Date(start);
        start = new Date(start.getTime() + start.getTimezoneOffset() * -60000)
        end = new Date(end);
        end = new Date(end.getTime() + end.getTimezoneOffset() * -60000)
        const subject = new Subject({ name, start, end, monday, tuesday, wednesday, thursday, friday })
        if (await subject.save()) {
            res.status(200).send("Successfully added a subject");
        }
        else {
            res.status(500).send("An error occured while adding a subject");
        }
    } catch (error) {
        res.status(500).send("An error occured");
    }
});

router.post('/addextra', async (req, res) => {
    try {
        let date = new Date(req.body.date);
        date = new Date(date.getTime() + date.getTimezoneOffset() * -60000)
        const subject = req.body.subject;
        const extralecture = new Extra({ date: date, number: req.body.number });
        let sub = await Subject.findOne({ "name": subject[0] });
        extralecture.subjects.push(sub);
        const extraSave = await extralecture.save();
        sub.extra.push(extraSave);
        await sub.save();
        res.status(200).send("Successfully added a extra lecture");
    } catch (error) {
        res.status(500).send({ message: "An error occured at the server" });
    }
})

router.post('/addholiday', async (req, res) => {
    try {
        let date = new Date(req.body.date);
        date = new Date(date.getTime() + date.getTimezoneOffset() * -60000)
        const subject = req.body.subject;
        const holiday = new Holiday({ date:date, number: req.body.number  });
        let sub = await Subject.findOne({ "name": subject[0] });
        holiday.subjects.push(sub);
        const holidaySave = await holiday.save();
        sub.holiday.push(holidaySave);
        await sub.save();
        res.status(200).send("Successfully added a holiday");
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "An error occured at the server" });
    }
})

router.post('/enrollcourse', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.body.subject == null) {
            res.status(500).send({ message: "Incomplete Information" });
        }
        else {
            const subj = req.body.subject;
            const id = req.user;
            var sub = await Subject.findOne({ name: subj })
            var user = await User.findOne({ _id: id })
            user.subjects.push(sub);
            if (await user.save()) {
                res.status(200).send({ message: "Successfully enrolled to the course" })
            }
            else {
                res.status(500).send({ message: "An error occured" });
            }
        }
    } catch (error) {
        res.status(500).send({ message: "An error occured at the server" });
    }
})

router.post('/absent', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const subj = req.body.subject;
        const id = req.user;
        const number = req.body.number;

        console.log(req.body)

        const student = await User.findOne({ _id: id });
        const subject = await Subject.findOne({ name: subj });

        if (student == null || subject == null || req.body.date == null || req.body.number == 0) {
            res.status(500).send({ message: "Incomplete details encountered" });
        }
        else {
            let date = new Date(req.body.date)
            const absent = new Absent({ student: student, subjects: subject, date: date, number: number });
            if (await absent.save()) {
                student.absent.push(absent);
                if (await student.save()) {
                    res.status(200).send({ message: "Successfully marked you absent" });
                }
                else {
                    res.status(500).send({ message: "An error occured while marking you absent" });
                }
            }
            else {
                res.status(500).send({ message: "An error occured while marking you absent" });
            }
        }
    } catch (error) {
        res.status(500).send({ message: "An error at the server" });
    }

})

router.post('/sub', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const sub = req.body.subject;
        const subject = await Subject.findOne({ name: sub });
        let start = new Date(subject.start);
        let end = new Date(subject.end);
        let schedule = [];
        let temp = [];
        while (start.getTime() <= end.getTime()) {
            let day = start.getDay();
            temp = [];
            if (day == 0 && subject.sunday != 0) {
                temp.push(new Date(start));
                temp.push(subject.sunday);
                schedule.push(temp);
            }
            else if (day == 1 && subject.monday != 0) {
                temp.push(new Date(start));
                temp.push(subject.monday);
                schedule.push(temp);
            }
            else if (day == 2 && subject.tuesday != 0) {
                temp.push(new Date(start));
                temp.push(subject.tuesday);
                schedule.push(temp);
            }
            else if (day == 3 && subject.wednesday != 0) {
                temp.push(new Date(start));
                temp.push(subject.wednesday);
                schedule.push(temp);
            }
            else if (day == 4 && subject.thursday != 0) {
                temp.push(new Date(start));
                temp.push(subject.thursday);
                schedule.push(temp);
            }
            else if (day == 5 && subject.friday != 0) {

                temp.push(new Date(start));
                temp.push(subject.friday);
                schedule.push(temp);
            }
            else if (day == 6 && subject.saturday != 0) {
                temp.push(new Date(start));
                temp.push(subject.saturday);
                schedule.push(temp);
            }
            start.setTime(start.getTime() + 1000 * 60 * 60 * 24);
        }
        for (var i = 0; i < subject.extra.length; i++) {
            let extra = await Extra.findOne({ _id: subject.extra[i] });
            let date = new Date(extra.date);
            for (var j = 0; j < schedule.length; j++) {
                let c = new Date(schedule[j][0]);
                if (date.getTime() == c.getTime()) {
                    schedule[j][1] = schedule[j][1] + extra.number;
                    break;
                }
                else if (date.getTime() < c.getTime()) {
                    let temp = [];
                    temp.push(date);
                    temp.push(extra.number);
                    schedule.splice(j + 1, 0, temp);
                    // console.log("Wassup");
                    break;
                }
            }
        }
        for (var i = 0; i < subject.holiday.length; i++) {
            let holiday = await Holiday.findOne({ _id: subject.holiday[i] });
            let date = new Date(holiday.date);
            for (var j = 0; j < schedule.length; j++) {
                let c = new Date(schedule[j][0]);
                if (date.getTime() == c.getTime()) {
                    schedule[j][1] = schedule[j][1] - holiday.number;
                    if (schedule[j][1] == 0) {
                        schedule.splice(j, 1);
                    }
                    break;
                }
            }
        }
        for (var i = 0; i < schedule.length; i++) {
            schedule[i].push(schedule[i][1]);
            schedule[i].push(0);
        }
        for (var i = 0; i < req.user.absent.length; i++) {
            let absent = await Absent.findOne({ _id: req.user.absent[i] });
            let subjectdoc = await Subject.find({ _id: absent.subjects });
            if (!subjectdoc[0]._id.equals(subject._id)) {
                continue;
            }
            let date = new Date(absent.date)
            for (var j = 0; j < schedule.length; j++) {
                let c = new Date(schedule[j][0]);
                if (date.getTime() == c.getTime()) {
                    schedule[j][2] = schedule[j][2] - absent.number;
                    schedule[j][3] = -1;
                    break;
                }
            }
        }
        let lectures = 0;
        let attended = 0;
        let currDate = new Date();
        for (var i = 0; i < schedule.length; i++) {
            lectures += schedule[i][1];
            attended += schedule[i][2];
            schedule[i].push(lectures);
            schedule[i].push(attended);
            let tableDate = new Date(schedule[i][0]);
            if (tableDate.getTime() <= currDate.getTime()) {
                schedule[i].push(1);
            }
            else {
                schedule[i].push(0);
            }
        }

        res.status(200).send(schedule);
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.get('/getsubjectnames', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user._id });
        let subjects = await Subject.find();
        let userSubjects = user.subjects;
        for (var i = 0; i < userSubjects.length; i++) {
            let result = await Subject.find({ _id: userSubjects[i] });
            for (var j = 0; j < subjects.length; j++) {
                let ans = result[0]._id;
                if (ans.equals(subjects[j]._id)) {
                    subjects.splice(j, 1);
                }
            }
        }
        res.status(200).send(subjects);
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.get('/getenrolledlist', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user._id });
        let subjects = [];
        for (var i = 0; i < user.subjects.length; i++) {
            let sub = await Subject.findOne({ _id: user.subjects[i] });
            subjects.push(sub.name);
        }
        res.status(200).send(subjects);
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.get('/list', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user._id });
        let subjects = [];
        subjects.push([]);
        for (var i = 0; i < user.subjects.length; i++) {
            let sub = await Subject.findOne({ _id: user.subjects[i] });
            subjects[0].push(sub.name);
        }
        subjects.push([]);
        subjects.push([]);
        let currDate = new Date();
        for (var i = 0; i < subjects[0].length; i++) {
            let subName = subjects[0][i];
            let subject = await Subject.findOne({ name: subName });
            let startDate = subject.start;
            let finishDate = subject.end;
            subjects[1].push([]);
            subjects[2].push([]);
            while (startDate.getTime() <= Math.min(finishDate.getTime(), currDate.getTime())) {
                let dayDate = new Date(startDate);
                let day = dayDate.getDay();
                if (day == 0 && subject.sunday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.sunday);
                }
                else if (day == 1 && subject.monday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.monday);
                }
                else if (day == 2 && subject.tuesday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.tuesday);
                }
                else if (day == 3 && subject.wednesday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.wednesday);
                }
                else if (day == 4 && subject.thursday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.thursday);
                }
                else if (day == 5 && subject.friday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.friday);
                }
                else if (day == 6 && subject.saturday != 0) {
                    subjects[1][i].push(dayDate);
                    subjects[2][i].push(subject.saturday);
                }
                startDate.setTime(startDate.getTime() + 1000 * 60 * 60 * 24);
            }
            for (var j = 0; j < subject.extra.length; j++) {
                let extra = await Extra.findOne({ _id: subject.extra[j] });
                let extraDate = new Date(extra.date);
                for (var k = 0; k < subjects[1][i].length; k++) {
                    let sample = new Date(subjects[1][i][k]);
                    if (extraDate.getTime() == sample.getTime()) {
                        subjects[2][i][k] = subjects[2][i][k] + extra.number;
                        break;
                    }
                    else if (extraDate.getTime() < sample.getTime()) {
                        subjects[1][i].splice(k, 0, extraDate);
                        subjects[2][i].splice(k, 0, extra.number);
                        break;
                    }
                }
            }
            for (var j = 0; j < subject.holiday.length; j++) {
                let holiday = await Holiday.findOne({ _id: subject.holiday[j] });
                let holidayDate = new Date(holiday.date);
                for (var k = 0; k < subjects[1][i].length; k++) {
                    let sample = new Date(subjects[1][i][k]);
                    if (holidayDate.getTime() == sample.getTime()) {
                        subjects[2][i][k] = subjects[2][i][k] - holiday.number;
                    }
                    if (subjects[2][i][k] == 0) {
                        subjects[1][i].splice(k, 1);
                        subjects[2][i].splice(k, 1);
                    }
                }
            }
        }
        for (var i = 0; i < user.absent.length; i++) {
            let absent = await Absent.findOne({ _id: user.absent[i] });
            let absentSubject = await Subject.findOne({ _id: absent.subjects });
            for (var j = 0; j < subjects[0].length; j++) {
                if (subjects[0][j] == absentSubject.name) {
                    for (var k = 0; k < subjects[1][j].length; k++) {
                        let absentDate = new Date(absent.date);
                        let compareDate = new Date(subjects[1][j][k]);
                        if (absentDate.getTime() == compareDate.getTime()) {
                            subjects[1][j].splice(k, 1);
                            subjects[2][j].splice(k, 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        res.status(200).send(subjects);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: { error } });
    }

})

router.get('/absentdata', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let user = req.user.id;
        user = await User.findOne({ _id: user });
        let absent = user.absent;
        let result = [];
        for (var i = 0; i < absent.length; i++) {
            let sub = await Absent.findOne({ _id: absent[i] }).populate({ path: 'subjects', model: Subject });
            result.push(sub);
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.delete('/absentDelete/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let id = req.user.id;
        let absentID = req.params.id;
        await User.findByIdAndUpdate(id, { $pull: { absent: absentID } })
        await Absent.findByIdAndDelete(absentID);
        res.status(200).send({ message: "Successfully deleted" });
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.post('/addNews', async (req, res) => {
    try {
        let name = req.body.name;
        let topic = req.body.topic;
        let date = new Date(req.body.date);
        date = new Date(date.getTime() + date.getTimezoneOffset() * -60000)

        let newss = new News({ topic: topic, date:date  });
        let subject = await Subject.findOne({ name: name});
        let result = await newss.save();
        subject.news.push(result);
        if (await subject.save()) {
            res.status(200).send({ message: "Successfully added information" });
        }
        else {
            res.status(500).send({ message: "Error occurred" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Unable to add news" });
    }
})

router.get('/sendAnnouncements',passport.authenticate('jwt', { session: false }),async (req,res)=>{
    try {
        let user= req.user.id;
        user = await User.findOne({_id:user});
        let list = user.subjects;
        let result = [];
        let temp=[];
        for(var i=0;i<list.length;i++)
        {
            temp=[];
            let subject = await Subject.findOne({_id:list[i]});
            if(subject.news.length>0 || subject.holiday.length>0)
            {
                temp.push([subject.name]);
                if(subject.news.length>0)
                {
                    for(var j=0;j<subject.news.length;j++)
                    {
                        let news = await News.findOne({_id:subject.news[j]});
                        temp.push(["News",news.date,news.topic]);
                    }
                }
                if(subject.holiday.length>0)
                {
                    for(var j=0;j<subject.holiday.length;j++)
                    {
                        let holiday = await Holiday.findOne({_id:subject.holiday[j]});
                        temp.push(["Holiday",holiday.date,holiday.number+" lecture"]);
                    }
                }
                if(subject.extra.length>0)
                {
                    for(var j=0;j<subject.extra.length;j++)
                    {
                        let extra = await Extra.findOne({_id:subject.extra[j]});
                        temp.push(["Extra",extra.date,extra.number+" lecture"]);
                    }
                }
                result.push(temp);
            }
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send("An error occured");
    }
})

module.exports = router;