const {
  findLiveClassesByCourse, findUpcomingLiveClasses, findLiveClassById,
  createLiveClass, updateLiveClassById, deleteLiveClassById,
} = require('../services/liveClassService');

const getLiveClasses = async (req, res, next) => {
  try {
    if (req.query.course_id) {
      const classes = await findLiveClassesByCourse(req.query.course_id);
      return res.json({ liveClasses: classes });
    }
    if (req.user.role === 'student') {
      const classes = await findUpcomingLiveClasses(req.user.id);
      return res.json({ liveClasses: classes });
    }
    return res.json({ liveClasses: [] });
  } catch (error) { next(error); }
};

const getLiveClassById = async (req, res, next) => {
  try {
    const liveClass = await findLiveClassById(req.params.id);
    if (!liveClass) return res.status(404).json({ error: 'Live class not found' });
    res.json({ liveClass });
  } catch (error) { next(error); }
};

const createLiveClassController = async (req, res, next) => {
  try {
    const liveClass = await createLiveClass(req.body);
    res.status(201).json({ message: 'Live class scheduled successfully', liveClass });
  } catch (error) { next(error); }
};

const updateLiveClass = async (req, res, next) => {
  try {
    const liveClass = await updateLiveClassById(req.params.id, req.body);
    res.json({ message: 'Live class updated successfully', liveClass });
  } catch (error) { next(error); }
};

const deleteLiveClass = async (req, res, next) => {
  try {
    await deleteLiveClassById(req.params.id);
    res.json({ message: 'Live class deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getLiveClasses, getLiveClassById, createLiveClassController, updateLiveClass, deleteLiveClass };
