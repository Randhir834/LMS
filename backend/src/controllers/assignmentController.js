const {
  findAssignmentsByCourse, findAssignmentById, createAssignment, updateAssignmentById, deleteAssignmentById,
  submitAssignment, findSubmissionsByAssignment, findSubmissionsByStudent, gradeSubmission,
} = require('../services/assignmentService');

const getAssignments = async (req, res, next) => {
  try {
    const assignments = await findAssignmentsByCourse(req.query.course_id);
    res.json({ assignments });
  } catch (error) { next(error); }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await findAssignmentById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ assignment });
  } catch (error) { next(error); }
};

const createAssignmentController = async (req, res, next) => {
  try {
    const assignment = await createAssignment(req.body);
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) { next(error); }
};

const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await updateAssignmentById(req.params.id, req.body);
    res.json({ message: 'Assignment updated successfully', assignment });
  } catch (error) { next(error); }
};

const deleteAssignment = async (req, res, next) => {
  try {
    await deleteAssignmentById(req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) { next(error); }
};

const submitAssignmentController = async (req, res, next) => {
  try {
    const submission = await submitAssignment({ ...req.body, student_id: req.user.id });
    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) { next(error); }
};

const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await findSubmissionsByAssignment(req.params.id);
    res.json({ submissions });
  } catch (error) { next(error); }
};

const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await findSubmissionsByStudent(req.user.id);
    res.json({ submissions });
  } catch (error) { next(error); }
};

const gradeSubmissionController = async (req, res, next) => {
  try {
    const submission = await gradeSubmission(req.params.submissionId, req.body);
    res.json({ message: 'Submission graded successfully', submission });
  } catch (error) { next(error); }
};

module.exports = {
  getAssignments, getAssignmentById, createAssignmentController, updateAssignment, deleteAssignment,
  submitAssignmentController, getSubmissions, getMySubmissions, gradeSubmissionController,
};
