'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Review Schema
const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref:'User' },
  postedOn: { type: Date, default: Date.now },
  rating: { type: Number,
            require: true,
            min:[1, 'Please Rate between 1-5'],
            max:[5, 'Please Rate between 1-5']},
  review: { type:String, require: true}
});

let Review = mongoose.model('Review', ReviewSchema);

module.exports.Review = Review;
