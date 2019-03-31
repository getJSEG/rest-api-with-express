'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/users').User;
const Course = require('../models/courses').Course;
const Review = require('../models/reviews').Review;
const authenticate = require('../middleware/authenticate').userAuthentication;

/************************************  USERS ROUTES ******************************/
router.get('/users', authenticate, (req, res, next) => {
//return authenticate user information
  User.findOne({ _id:req.session.userId}, (err, user) => {
    return res.json(user);
  });

});

router.post('/users', (req, res, next) => {
//creating a new user and a new session for the new user
  const newUser = new User(req.body);

  newUser.save( (err, user) => {
    if(err) return next(err);
    req.session.userId = user._id;
    res.status(201).set('Location', '/').end();
  });
});

/************************************  GET COURSES ROUTES ******************************/
router.get('/courses', (req, res, next) => {
 //return all courses _id and title properties
  Course.find({}, "_id title", (err, courses) => {
    if(err) return next(err);
    res.json(courses);
  });
});

router.get('/course/:courseId', (req, res, next) => {
//return all properties and information for the provided course ID
  Course.findById(req.params.courseId, null, (err, course) => {
    if(err) return next(err);
    res.json(course);
  });
});

router.get('/courses/:courseId', (req, res, next) => {
//returns the related user and reviews documents
  Course.findById(req.params.courseId, 'user reviews')
  .populate('user', 'fullName')
  .populate('reviews')
  .exec( (err, course) => {
    if(err) return next(err);
    res.json(course);
  });
});

router.post('/courses', authenticate, (req, res, next) => {
//create a course and dosent return any content //with a 201 code
    let newCourse = new Course(req.body);
    newCourse.user = req.session.userId;

    newCourse.save( (err, course) => {
      if(err) return next(err);
      res.status(201).set('Location', '/').end();
    });
});

router.put('/courses/:courseId', authenticate, (req, res, next) => {
//dont return any content and updates the course witht eh given _ID
    Course.findOneAndUpdate({ _id: req.params.courseId }, {$set: req.body }, (err, course) => {
      if(err) return next(err);
      res.status(204).set('Location', '/').end();
    });
});


router.post('/courses/:courseId/reviews', authenticate, (req, res, next) => {
//create a review with the authenticated user information
//and block the user from reviewing their own courses
    Course.findById(req.params.courseId)
    .populate('reviews')
    .exec((err, course)=> {
      if(req.session.userId.match(course.user)){
        const error = new Error("you cant review your own course");
        error.status = 403;
        return next(error);
      }

      return new Promise( resolve => {
        let review = new Review(req.body);
        review.user = req.session.userId;

        review.save( (err, review) => {
          if(err) return next(err);
        });
        resolve(review);
      }).then( review => {
        course.reviews.push(review);

        course.save( (err, review) => {
          if(err) return next(err);
          res.status(201).set('Location', '/').end();
        });
      });

    });
});

module.exports = router;
