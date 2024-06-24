const Issue = require('../models/Issue');

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
  try {
    const issues = await Issue.find(filter);
    res.json(issues);
  } catch (error) {
    res.json({ error: 'could not retrieve issues' });
  }
};

const updateIssue = async (req, res) => {
  const { project } = req.params;
  const { _id, ...updates } = req.body;
  if (!_id) {
    return res.json({ error: 'missing _id' });
  }
  if (Object.keys(updates).length === 0) {
    return res.json({ error: 'no update field(s) sent', '_id': _id });
  }
  try {
    const issue = await Issue.findByIdAndUpdate(_id, { ...updates, updated_on: new Date() }, { new: true });
    if (!issue) {
      return res.json({ error: 'could not update', '_id': _id });
    }
    res.json({ result: 'successfully updated', '_id': _id });
  } catch (error) {
    res.json({ error: 'could not update', '_id': _id });
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
