const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // Create an issue with every field: POST request to /api/issues/{project}
    test('should create an issue with every field', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/test-project')
.send({
        issue_title: 'Test Title',
        issue_text: 'Test issue text',
        created_by: 'Test User',
        assigned_to: 'Test Assignee',
        status_text: 'In Progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Test Title');
        assert.equal(res.body.issue_text, 'Test issue text');
        assert.equal(res.body.created_by, 'Test User');
        assert.equal(res.body.assigned_to, 'Test Assignee');
        assert.equal(res.body.status_text, 'In Progress');
        done();
      });
    });
  // Create an issue with only required fields: POST request to /api/issues/{project}
  test('should create an issue with only required fields', function(done) {
    chai
      .request(server)
      .post('/api/issues/test-project')
      .send({
        issue_title: 'Required Fields Title',
        issue_text: 'Required fields issue text',
        created_by: 'Required Fields User'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Required Fields Title');
        assert.equal(res.body.issue_text, 'Required fields issue text');
        assert.equal(res.body.created_by, 'Required Fields User');
        assert.equal(res.body.assigned_to, ''); // Default empty string
        assert.equal(res.body.status_text, ''); // Default empty string
        assert.equal(res.body.open, true); // Default value
        done();
      });
  });
  // Create an issue with missing required fields: POST request to /api/issues/{project}
  // View issues on a project: GET request to /api/issues/{project}
  // View issues on a project with one filter: GET request to /api/issues/{project}
  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  // Update one field on an issue: PUT request to /api/issues/{project}
  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  // Update an issue with missing _id: PUT request to /api/issues/{project}
  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  // Delete an issue: DELETE request to /api/issues/{project}
  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  // Delete an issue with missing _id: DELETE request to /api/issues/{project}

});
