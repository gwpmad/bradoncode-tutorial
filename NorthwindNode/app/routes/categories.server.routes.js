'use strict';


// The arguments request and response are part of the express framework with the
// request object holding data from the HTTP request such as URL, query string
// parameters etc and the response object allowing the controller to change the state
// of the response i.e. HTTP status code, raw response (HTML, JSON etc) before it
// is returned to the client.
module.exports = function(app) {
    var categories = require('../../app/controllers/categories.server.controller');

    app.route('/categories')
        // define get request
        .get(categories.list)
        // define post request
        .post(categories.create);

    // the categoryId param is added to the params object for the request
    app.route('/categories/:categoryId') //This calls the 'categoryId' that is created at the bottom
        .get(categories.read)
        .put(categories.update)
        .delete(categories.delete);


// The route detail has been added to the app variable (which is the instance
// of Express being used). The .get function for the app route 'function' is set
// to call the anonymous function defined after .get. In the commented out example
// below, That function uses the .json method on the response, defining what it returns.

// module.exports = function(app) {
//     var categories = require('../../app/controlleres/categories.server.controller');
//
//     app.route('/categories')
//         .get(function (request, response) {
//           response.json([{name: 'Beverages'}, {name: 'Condiments'}]);
//         });
// };

// The route doesn't interact directly with the model. That is the controller's
// job.


// ** Finish by binding the article middleware **
// What's this? Where the categoryId is present in the URL
// the logic to 'get by id' is handled by this single function
// and added to the request object i.e. request.category.
// GM note: This is called before the lines above when read, update or delete is used;
// it binds the category found by the id to the request that is sent. See the note
// in capitals in categories.server.controller.js.
  app.param('categoryId', categories.categoryByID);
  // adding a param - defining 'categoryId'

};
