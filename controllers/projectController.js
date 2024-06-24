const Issue = require('../models/Issue');
const mongoose = require('mongoose')
const createIssue = async (req, res) => {
  const { project } = req.params;
  const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

  // Check if required fields are present
  if (!issue_title || !issue_text || !created_by) {
    return res.json({ error: 'required field(s) missing' });
  }

  try {
    // Check if an issue with the same title, created_by, and project already exists
    // const existingIssue = await Issue.findOne({ issue_title,issue_text, created_by, project });
    // if (existingIssue) {
    //   return res.json({ error: 'An issue with the same title and creator already exists' });
    // }

    // Create a new issue
    const newIssue = new Issue({
      issue_title,
      issue_text,
      created_by,
      assigned_to: assigned_to || '',
      status_text: status_text || '',
      created_on: new Date(),
      updated_on: new Date(),
      project
    });
    await newIssue.save();
    res.json(newIssue);
  } catch (error) {
    res.json({ error: 'could not create issue' });
  }
};

const viewIssues = async (req, res) => {
  const { project } = req.params;
  const query = req.query;
  try {
    let issues;
    if (Object.keys(query).length > 0) {
      issues = await Issue.find({...query});
    } else {
      issues = await Issue.find({ project });
    }
    res.json(issues);
  } catch (error) {
    res.json({ error: 'could not retrieve issues' });
  }
};


const updateIssue = async (req, res) => {
  const { project } = req.params; // Correctly extracting project from params
  const _id  = req.query._id; // Assuming _id is intended to be in the query, adjust accordingly if it should be in the path
  const {...updates } = req.body;
  console.log(_id)
  console.log({ project, _id,...updates });

  // Check if _id is missing
  if (!_id) {
    return res.status(400).json({ error: 'missing _id' });
  }

  // Validate _id format
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).json({ error: 'invalid _id format' });
  }

  // Check if no updates are provided
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'no update field(s) sent', _id });
  }

  try {
    // Find the issue document
    const issue = await Issue.findOne({ _id, project });
    if (!issue) {
      return res.status(404).json({ error: 'could not update', _id });
    }

    // Update the document and set updated_on to current time
    await Issue.findByIdAndUpdate(
      _id,
      {...updates, updated_on: new Date() },
      { new: true } // Optional: Return the updated document
    );

    return res.json({ result: 'successfully updated', _id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'could not update', _id });
  }
};

const deleteIssue = async (req, res) => {
  const { project } = req.params;
  const { _id } = req.body;
  if (!_id) {
    return res.json({ error: 'missing _id' });
  }
  try {
    const issue = await Issue.findOne({ _id, project });
    if (!issue) {
      return res.json({ error: 'could not delete', '_id': _id });
    }
    await Issue.findByIdAndDelete(_id);
    res.json({ result: 'successfully deleted', '_id': _id });
  } catch (error) {
    res.json({ error: 'could not delete', '_id': _id });
  }
};

module.exports = {
  createIssue,
  viewIssues,
  updateIssue,
deleteIssue
};
