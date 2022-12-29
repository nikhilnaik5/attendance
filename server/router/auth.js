const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../model/userSchema');
require('../config/passjwt');

router.get('/', (req, res) => {
    console.log("In the page");
    res.send("Welcome to the page from auth.js");
});

router.post('/register', async (req, res) => {

    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(422).json("Please fill properly");
    }

    try {

        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json("You are already registered");
        }
        else if (password != cpassword) {
            return res.status(422).json("Password dosen't match");
        }

        const user = new User({ name, email, phone, password, cpassword });
        const saveUser = await user.save()

        if (saveUser) {
            res.status(201).json("Registeration Successful");
        }
        else {
            res.status(500).json("Failed to Register");
        }

    } catch (err) {
        console.log(err);
    }

});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json("Please fill the data");
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (!userExist) {
            return res.status(500).json("Invalid Info");
        }

        const matchPass = await bcrypt.compare(password, userExist.password);

        if (matchPass) {

            const payload = {
                username: userExist.name,
                id: userExist._id
            }

            const token = jwt.sign(payload, "SECRETKEY", { expiresIn: "1d" })
            console.log(token);
            res.status(200).send({
                success: true,
                message: "Logged in successfully!",
                token: "Bearer " + token
            })
        }
        else {
            return res.status(500).json("Unsuccessful");
        }

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;