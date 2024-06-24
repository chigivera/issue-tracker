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
  test('should return an error when required fields are missing', function(done) {
    chai
      .request(server)
      .post('/api/issues/test-project')
      .send({
        // Missing issue_title, issue_text, and created_by
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });
  // View issues on a project: GET request to /api/issues/{project}
  test('should get issues for a project', function(done) {
    chai
      .request(server)
      .get('/api/issues/test-project')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.isObject(issue);
          assert.property(issue, 'issue_title');
          assert.property(issue, 'issue_text');
          assert.property(issue, 'created_by');
          assert.property(issue, 'assigned_to');
          assert.property(issue, 'status_text');
          assert.property(issue, 'created_on');
          assert.property(issue, 'updated_on');
          assert.property(issue, 'open');
          assert.property(issue, '_id');
        });
        done();
      });
  });
  // View issues on a project with one filter: GET request to /api/issues/{project}
  test('should get issues for a project with one filter', function(done) {
    const project = 'test-project';
    const filterField = 'status_text';
    const filterValue = 'In Progress';

    chai.request(server)
      .get(`/api/issues/${project}?${filterField}=${filterValue}`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.isObject(issue);
          assert.property(issue, 'issue_title');
          assert.property(issue, 'issue_text');
          assert.property(issue, 'created_by');
          assert.property(issue, 'assigned_to');
          assert.property(issue, 'status_text');
          assert.property(issue, 'created_on');
          assert.property(issue, 'updated_on');
          assert.property(issue, 'open');
          assert.property(issue, '_id');
          assert.equal(issue[filterField], filterValue);
        });
        done();
      });
  });
  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  test('should get issues for a project with multiple filters', function(done) {
    const project = 'test-project';
    const filters = {
      status_text: 'In Progress',
      assigned_to: 'John Doe'
    };

    chai.request(server)
      .get(`/api/issues/${project}`)
      .query(filters)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.isObject(issue);
          assert.property(issue, 'issue_title');
          assert.property(issue, 'issue_text');
          assert.property(issue, 'created_by');
          assert.property(issue, 'assigned_to');
          assert.property(issue, 'status_text');
          assert.property(issue, 'created_on');
          assert.property(issue, 'updated_on');
          assert.property(issue, 'open');
          assert.property(issue, '_id');
          assert.equal(issue.status_text, filters.status_text);
          assert.equal(issue.assigned_to, filters.assigned_to);
        });
        done();
      });
  });
describe('Update', function() {
  let testIssueId; // This will store the _id of the test issue created for testing purposes

  // Create a test issue before running update tests
  before(function(done) {
    chai.request(server)
      .post('/api/issues/test-project')
      .send({
        issue_title: 'Test Issue',
        issue_text: 'This is a test issue for update testing',
        created_by: 'Test User'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        testIssueId = res.body._id;// Store the _id of the created issue
        done();
      });
  });

  // Update one field on an issue: PUT request to /api/issues/{project}
  test('should update one field on an issue', function(done) {
    const updateData = {
      _id: testIssueId,
      issue_text: 'Updated issue text'
    };

    chai.request(server)
      .put(`/api/issues/test-project`)
      .send(updateData)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
  
       
      });
  });

  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  test('should update multiple fields on an issue', function(done) {
    const updateData = {
      _id: testIssueId,
      issue_text: 'Updated issue text',
      assigned_to: 'John Doe',
      status_text: 'In Progress'
    };

    chai.request(server)
      .put(`/api/issues/test-project`)
      .send(updateData)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
   

       
      });
  });

  // Update an issue with missing _id: PUT request to /api/issues/{project}
  test('should return error when updating issue with missing _id', function(done) {
    const updateData = {
      issue_text: 'Updated issue text'
    };

    chai.request(server)
      .put(`/api/issues/test-project`)
      .send(updateData)
      .end(function(err, res) {
        assert.equal(res.status, 400); // Assuming 400 Bad Request is returned for missing _id
        assert.isObject(res.body);

        done();
      });
  });

  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  test('should return error when updating issue with no fields to update', function(done) {
    const updateData = {
      _id: testIssueId // Valid _id, but no fields to update
    };

    chai.request(server)
      .put(`/api/issues/test-project`)
      .send(updateData)
      .end(function(err, res) {
        assert.equal(res.status, 400); // Assuming 400 Bad Request is returned for no fields to update
        assert.isObject(res.body);
        done();
      });
  });

  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test('should return error when updating issue with an invalid _id', function(done) {
    const updateData = {
      _id: 'invalid_id',
      issue_text: 'Updated issue text'
    };

    chai.request(server)
      .put(`/api/issues/test-project`)
      .send(updateData)
      .end(function(err, res) {
        assert.equal(res.status, 400); // Assuming 400 Bad Request is returned for invalid _id
        assert.isObject(res.body);
        done();
      });
  });

  // Clean up: Delete the test issue after all tests
  after(function(done) {
    chai.request(server)
      .delete(`/api/issues/test-project`)
      .send({ _id: testIssueId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        done();
      });
  });
});

  // Delete an issue: DELETE request to /api/issues/{project}
  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  // Delete an issue with missing _id: DELETE request to /api/issues/{project}

});
