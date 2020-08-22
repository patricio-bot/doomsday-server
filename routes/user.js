require('dotenv').config();

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user');
const Task = require('../models/task');
const axios = require('axios');
const getLifeExpectancy = require('../helpers/getLifeExpectancy');

const { route } = require('./auth');



router.get('/', (req, res, next) => {
    User.find()
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
router.post('/data', (req, res, next) => {
    const { country, height, weight, isSmoker, isDrinker, age } = req.body;
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
            let badHabitsYears = 0;
            if (isSmoker) badHabitsYears += sinDictionary.isSmoker;

            if (isDrinker) badHabitsYears += sinDictionary.isDrinker;
            const yearsRemainingTotal = yearsRemaining + badHabitsYears + healthYears;
            res.json({ yearsRemainingTotal })
            //console.log({ yearsRemaining, healthYears, badHabitsYears, yearsRemainingTotal, health, bmi });
        })
        .catch((error) => {
            console.log(error)
        })
});
router.get('/:id', (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
        .populate("hasSins, tasksCreated")
        .then((user) => {
            res.status(200).json(user)
        })
        .catch(error => {
            next(createError(error));
        });
});
router.put('/edit', (req, res, next) => {
    const userId = req.session.currentUser._id;
    const { firstName, lastName, gender, image } = req.body;

    User.findByIdAndUpdate(userId, { firstName, lastName, gender, image }, { new: true })
        .then((userUpdated) => {
            req.session.currentUser = userUpdated;
            res.status(200).json(userUpdated);
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;