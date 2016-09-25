/**
 * Created by Ali on 2016-09-23.
 */

const async = require('async');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Poll = require('../models/Poll');


/**
 * GET /newpoll
 * New poll page.
 */
exports.getNewPoll = (req, res) => {
    res.render('newpoll', {
        title: 'New Poll'
    });
};


/**
 * POST /newpoll
 * Submit a poll made by user.
 */
exports.postNewPoll = function (req, res, next) {
    req.assert('title', "Question cannot be blank.").notEmpty();
    req.assert('option1', "Option 1 cannot be blank.").notEmpty();
    req.assert('option2', "Option 2 cannot be blank.").notEmpty();
    //req.assert(req.user, "You must login to post a poll.").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/newpoll');
    }

    let opt1 = req.body.option1;
    let opt2 = req.body.option2;

    let options = [];
    options.push({title: opt1, votes: 0});
    options.push({title: opt2, votes: 0});



    const poll = new Poll({
        postedBy: "dummyID",
        question: req.body.title,
        options: options,
        comments: new Array(),
        datePosted: Date.now(),
    });

    poll.save((err) =>
    {
        if (err){
            return next(err);
        }
        //some error handling here
        req.flash('success', { msg: 'Poll successfully posted!' });
        res.redirect('/newpoll');
    });

};

/**
 * GET /newpoll
 * New poll page.
 */
exports.getPolls = (req, res) => {
    Poll.find({}, function(err, polls) {
        if (err) throw err;

        res.render('home', {
                pollItems: polls
            }

        );

        return polls;
    });
};