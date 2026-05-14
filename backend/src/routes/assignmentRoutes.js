const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { upload, uploadToSupabase } = require('../services/storageService');
const {
  getAssignments, getAssignmentById, createAssignmentController, updateAssignment, deleteAssignment,
  submitAssignmentController, getSubmissions, getMySubmissions, gradeSubmissionController,
} = require('../controllers/assignmentController');

const router = express.Router();

router.get('/', authenticate, getAssignments);
router.get('/my-submissions', authenticate, authorizeRoles('student'), getMySubmissions);
router.get('/:id', authenticate, getAssignmentById);
router.post('/', authenticate, authorizeRoles('instructor', 'admin'), createAssignmentController);
router.put('/:id', authenticate, authorizeRoles('instructor', 'admin'), updateAssignment);
router.delete('/:id', authenticate, authorizeRoles('instructor', 'admin'), deleteAssignment);

router.post('/:id/submit', authenticate, authorizeRoles('student'), upload.single('file'), async (req, res, next) => {
  try {
    let file_url = req.body.file_url;
    if (req.file) {
      const result = await uploadToSupabase(req.file, 'assignments');
      file_url = result.publicUrl;
    }
    req.body.file_url = file_url;
    submitAssignmentController(req, res, next);
  } catch (error) { next(error); }
});
router.get('/:id/submissions', authenticate, authorizeRoles('instructor', 'admin'), getSubmissions);
router.put('/:id/submissions/:submissionId/grade', authenticate, authorizeRoles('instructor', 'admin'), gradeSubmissionController);

module.exports = router;
