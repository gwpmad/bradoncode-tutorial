'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Category = mongoose.model('Category'),
  _ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
  var category = new Category(req.body);

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(201).json(category);
    }
  });
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
  Category.findById(req.params.categoryId).exec(function(err, category) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!category) {
        return res.status(404).send({
          message: 'Category not found'
        });
      }
      res.json(category);
    }
  });
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
  var category = req.category; // why is req.params not required? A: I think because for read, we're using
  // findById so need specifically the ID in the URL, so we have to query the params. Whereas here and in delete
  // we're using just the category key in the req json. Bear in mind this is a PUT request so a json will be sent,
  // whereas presumably one won't be in a GET request like read.

  category = _.extend(category, req.body);
  /**
   the lodash extend method (since deprecated in favour of assignin) adds json
   key/values to an existing json. So in this example the req.body key/values
   are added to the category key/values, overwriting them as appropriate.
   https://lodash.com/docs#assignIn
   */

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
  var category = req.category;

// the remove() function: http://mongoosejs.com/docs/api.html#model_Model.remove
// in this case there's no conditions argument (see url above) so it knows to go
// straight to the callback (click 'show code' on link above to see why it can
// do this)
  category.remove(function(err) {
    if (err){
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
      res.json(category); // return the category you've deleted (I think)
    }
  });

};

/**
 * List of Categories
 */
exports.list = function(req, res) {
  Category.find().exec(function(err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

/**
* Category middleware

* Middleware functions are functions that have access to the request object
* (req), the response object (res), and the next middleware function in the
* application’s request-response cycle. i.e. they are in the middle
*/

// THIS METHOD IS USED BEFORE OTHERS THAT USE THE CATEGORYID PARAM (E.G.
// READ, UPDATE, DELETE) (I.E. IT COMES IN THE MIDDLE) AND BINDS THE CATEGORY
// THAT IT FINDS TO THE REQ THAT IS THEN USED BY THOSE METHODS.
exports.categoryByID = function(req, res, next, id){

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category not found'
    });
  }

  // If the current middleware function does not end the request-response cycle,
  // it must call next() to pass control to the next middleware function.
  // Otherwise, the request will be left hanging.

    Category.findById(id).exec(function(err, category) {
      if (err) return next(err);
      if (!category) {
        return res.status(404).send({
          message: 'Category not found'
        });
      }
      req.category = category;
      next(); // calling the next middleware function
    });

};
