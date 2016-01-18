'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Product = mongoose.model('Product'),
    _ = require('lodash');

// Create
exports.create = function(req, res) {
  var product = new Product(req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(201).json(product);
      console.log(res);
    }
  });
};

// Show current product
exports.read = function(req, res) {
  Product.findById(req.params.productId).exec(function(err, product) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!product) {
        return res.status(404).send({
          message: 'Product not found'
        });
      }
      res.json(product);
    }
  });
};

// Update
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

exports.delete = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

// List
exports.list = function(req, res) {
  Product.find().exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(products);
    }
  });
};

// Middleware to find by ID (used for params in read, update, destroy)
exports.productByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product not found'
    });
  }

  Product.findById(id).exec(function(err, product) {
    if (err) return next(err);
    if (!product) {
      return res.status(404).send({
        message: 'Product not found'
      });
    }
    req.product = product;
    next();
  });
};
