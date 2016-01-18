'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* Validation
*/
function validateLength (v) {
  return v.length <= 40;
}

/**
* Product Schema
*/
var ProductSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: 'invalid category'
  },
  created: {
      type: Date,
      default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'name cannot be blank',
    validate: [validateLength, 'name must be 40 chars in length or less']
  },
  quantityPerUnit: {
    type: String
  },
  unitPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  discontinued: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Product', ProductSchema);
