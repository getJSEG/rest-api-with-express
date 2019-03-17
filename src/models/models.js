'use strict';
const mongoose = required('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
      type: String,
      required: true
    },
    emailAdress:{
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String.
      required: true
    }
});

const reviewSchema = new Schema({
  user:{},
  postedOn: { type: Date, Default: Date.now },
  rating:{ type: Number },
  review: { type:String }
});

const CoursesSchema = new Schema({
  user:[],
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
  reviews:[{}];
});
