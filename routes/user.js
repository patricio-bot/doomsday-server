require('dotenv').config();

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user');
const Task = require('../models/task');
const axios = require('axios');
const getLifeExpectancy = require('../helpers/getLifeExpectancy');
const getDisease = require('../helpers/getDisease');
const generateSins = require('../helpers/generateSins')
const { route } = require('./auth');
const { isLoggedIn } = require('../helpers/middlewares');



router.get('/', (req, res, next) => {
    console.log('aqui');
    User.find()
        .populate('tasksCreated')
        .then(users => {
            res.status(200).json(users)

        })
        .catch((error) => {
            next(createError(error))
        });
});
const sinDictionary = {
    'Obese Class II': -10,
    'Normal': 0,
    'Severe Thinness': -15,
    'Overweight': -5,
    'Obese Class I': -5,
    'Moderate Thinness': -2,
    'isSmoker': -8,
    'isDrinker': -6,
    'Mild Thinness': -4,
    'Obese Class III': -20,
    'Healthy weight': +5,
    'Underweight': -6

}
router.put('/edit', (req, res, next) => {
    //const userId = req.session.currentUser._id;
    const { _id } = req.session.currentUser;
    const { firstName, lastName, gender, image, height, weight, age, isDrinker, isSmoker, country, description } = req.body;

    if (!age || !weight || !height) {
        next(createError(400))
        return
    }

    axios({
        "method": "GET",
        "url": "https://fitness-calculator.p.rapidapi.com/bmi",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
            "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
            "useQueryString": true
        }, "params": {
            "age": `${age}`,
            "height": `${height}`,
            "weight": `${weight}`
        }
    })
        .then((response) => {
            const { bmi, health } = response.data;
            const yearsRemaining = getLifeExpectancy(country, age);
            const healthYears = sinDictionary[health];
            const userDisease = getDisease(response.data.health);
            let badHabitsYears = 0;
            if (isSmoker) badHabitsYears += sinDictionary.isSmoker;

            if (isDrinker) badHabitsYears += sinDictionary.isDrinker;
            const yearsRemainingTotal = yearsRemaining + badHabitsYears + healthYears;


            let now = new Date().getTime();

            let future = Math.floor(yearsRemainingTotal * 31536000000);
            let countDownDate = future - now;
            let days = Math.floor(countDownDate / (1000 * 60 * 60 * 24));
            let hours = Math.floor((countDownDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((countDownDate % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((countDownDate % (1000 * 60)) / 1000);

            console.log({ yearsRemaining, healthYears, badHabitsYears, yearsRemainingTotal, health, bmi, countDownDate, now, future });
            console.log(`${days} d ${hours} h ${minutes} m ${seconds} s`);
            console.log(userDisease);

            const hasSins = generateSins(isSmoker, isDrinker, health)
            console.log(hasSins);



            User.findByIdAndUpdate(_id, { yearsRemaining: yearsRemainingTotal, firstName, lastName, gender, image, height, weight, age, isDrinker, isSmoker, country, description, health, hasSins, completedProfile: true }, { new: true })

                .then((userUpdated) => {
                    res.status(200).json(userUpdated)
                })


        })

        .catch((error) => {
            console.log(error)
        })
});
router.get('/profile', isLoggedIn(), (req, res, next) => {

    let userId = req.session.currentUser._id;
    User.findById(userId)
        .populate("hasSins, tasksCreated")
        .then((user) => {
            res.status(200).json(user)
        })
        .catch(error => {
            next(createError(error));
        });
});
router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .populate("hasSins, tasksCreated")
        .then((user) => {
            res.status(200).json(user)
        })
        .catch(error => {
            next(createError(error));
        });
});
router.put('/tasks', (req, res, next) => {
    const { _id } = req.session.currentUser;
    const { tasks } = req.body;

    User.findByIdAndUpdate(_id, { hasTasks: tasks }, { new: true })
        .then((userUpdated) => {
            console.log('user updated------>', userUpdated);
            req.session.currentUser = userUpdated;
            res.status(200).json(userUpdated);
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;