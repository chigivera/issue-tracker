'use strict';
const {createIssue,viewIssues,updateIssue,deleteIssue} = require('../controllers/projectController')
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(viewIssues)
    
    .post(createIssue)
    
    .put(updateIssue)
    
    .delete(deleteIssue);
    
};
