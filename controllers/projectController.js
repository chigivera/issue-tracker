const Issue = require('../models/Issue');
const mongoose = require('mongoose')
const createIssue = async (req, res) => {
  const { project } = req.params;
  const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
  if (!issue_title || !issue_text || !created_by) {
    return res.json({ error: 'required field(s) missing' });
  }
  try {
    const newIssue = new Issue({
      issue_title,
      issue_text,
      created_by,
      assigned_to: assigned_to || '',
      status_text: status_text || '',
      created_on: new Date(),
      updated_on: new Date()
    });
    await newIssue.save();
    res.json(newIssue);
  } catch (error) {
    res.json({ error: 'could not create issue' });
  }
};

const viewIssues = async (req, res) => {
  const { project } = req.params;
  const filter = req.query;
  console.log(filter)
  try {
    const issues = await Issue.find(filter);
    console.log(issues)
    res.json(issues);
  } catch (error) {
    res.json({ error: 'could not retrieve issues' });
  }
};

const updateIssue = async (req, res) => {
  const { project } = req.params;
  const { _id, ...updates } = req.body;

  // Validate _id before proceeding
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).json({ error: 'invalid _id format' });
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'no update field(s) sent', _id });
  }

  try {
    const issue = await Issue.findByIdAndUpdate(
      _id,
      { ...updates, updated_on: new Date() }
    );

    if (!issue) {
      return res.status(404).json({ error: 'could not update', _id });
    }

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
    const issue = await Issue.findByIdAndDelete(_id);
    if (!issue) {
      return res.json({ error: 'could not delete', '_id': _id });
    }
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
