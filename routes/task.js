const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user');
const Task = require('../models/task');
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin,
    validationSignup
} = require("../helpers/middlewares");

router.post('/add', isLoggedIn(), (req, res, next) => {

    const { title, description, score, image, kind } = req.body;

    const userId = req.session.currentUser._id;

    const newTask = new Task({ title, description, score, image, kind, author: userId });

    if (!title || !description || !score) next(createError(400));

    Task.findOne({ title })
        .then((taskFound) => {
            if (taskFound) {
                res.status(401).json({ "message": 'task already exists' });
                return;
            }
            newTask.save()
                .then((task) => {
                    User.findByIdAndUpdate(userId, { $push: { tasksCreated: task._id } }, { new: true })
                        .then(() => {
                            res.status(200).json(newTask);
                        })
                        .catch(error => next(error));
                })
                .catch(error => next(createError(error)));
        });
});


router.get('/:id', (req, res, next) => {
    const taskId = req.params.id;

    Task.findById(taskId)
        .then((taskDetail) => {
            res.status(200).json(taskDetail)
        })
        .catch(error => next(createError(error)));
});


router.put('/edit/:id', (req, res, next) => {
    const taskId = req.params.id;
    const { title, description, score, image, kind } = req.body;
    Task.findByIdAndUpdate(taskId, { title, description, score, image, kind }, { new: true })
        .then((taskUpdated) => {
            res.status(200).json(taskUpdated);
        })
        .catch(error => next(createError(error)));
});


router.delete('/delete/:id', (req, res, next) => {
    const taskId = req.params.id;

    Task.findByIdAndRemove(taskId)
        .then(() => {
            User.updateOne({}, { $pull: { tasksCreated: taskId } }, { new: true });
        })
        .then(() => {
            res.status(200).json({ 'message': 'Task deleted' });
        })
        .catch(error => next(createError(error)));


});

/* router.put('/edit/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.session.currentUser._id;
        const { title, description, score, image, kind } = req.body;

        
        await Task.findByIdAndUpdate(taskId, { title, description, score, image, kind }, { new: true });
        const taskUpdated = await Task.findById(taskId);
        res.status(200).json(taskUpdated);

    }
    catch (error) { next(error) }
}); */






module.exports = router;