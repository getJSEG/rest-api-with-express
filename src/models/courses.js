'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Course Schema
const CourseSchema = new Schema({
  user:{ type: Schema.Types.ObjectId, ref:'User' },
  title:{
    type:String,
    required: true
  },
  description: {
    type:String,
    required: true
  },
  estimatedTime: { type: String },
  materialsNeeded: { type: String },
  steps:[{ stepNumber:{ type:String }, title:{ type: String }, description:{ type: String } }],
  reviews: [ { type: Schema.Types.ObjectId, ref:'Review' } ]
});


let Course = mongoose.model('Course', CourseSchema);

module.exports.Course = Course;
