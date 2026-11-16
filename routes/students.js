const express = require('express');
const { body, param } = require('express-validator');
const Student = require('../models/Student');
const cache = require('../utils/cache');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const router = express.Router();
router.use(requireAuth);
const rules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must contain 2–80 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email.'),
  body('course').trim().isLength({ min: 2, max: 80 }).withMessage('Enter a valid course.'),
  body('enrollmentNo').trim().isLength({ min: 3, max: 30 }).withMessage('Enrollment number must contain 3–30 characters.'),
  body('phone').optional({ values: 'falsy' }).matches(/^[0-9+()\-\s]{7,20}$/).withMessage('Enter a valid phone number.'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status.')
];
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q ? { $or: ['name','email','course','enrollmentNo'].map(k => ({ [k]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } })) } : {};
    const students = await Student.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.render('dashboard', { title: 'Dashboard', students, q });
  } catch (err) { next(err); }
});
router.get('/new', (req, res) => res.render('student-form', { title: 'Add student', student: {}, action: '/students' }));
router.post('/', rules, handleValidation, async (req, res, next) => {
  try {
    const student = await Student.create({ ...req.body, createdBy: req.session.user.id });
    cache.flushAll();
    res.redirect('/students?created=1');
  } catch (err) {
    if (err.code === 11000) return res.status(409).render('student-form', { title: 'Add student', student: req.body, action: '/students', error: 'That enrollment number is already registered.' });
    next(err);
  }
});
router.get('/:id/edit', param('id').isMongoId(), handleValidation, async (req, res, next) => {
  try { const student = await Student.findById(req.params.id).lean(); if (!student) return res.status(404).render('404', { title: 'Not found' }); res.render('student-form', { title: 'Edit student', student, action: `/students/${student._id}?_method=PUT` }); }
  catch (err) { next(err); }
});
router.put('/:id', param('id').isMongoId(), ...rules, handleValidation, async (req, res, next) => {
  try { const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!student) return res.status(404).render('404', { title: 'Not found' }); cache.flushAll(); res.redirect('/students?updated=1'); }
  catch (err) { if (err.code === 11000) return res.status(409).render('student-form', { title: 'Edit student', student: { ...req.body, _id: req.params.id }, action: `/students/${req.params.id}?_method=PUT`, error: 'That enrollment number is already registered.' }); next(err); }
});
router.delete('/:id', param('id').isMongoId(), handleValidation, async (req, res, next) => {
  try { await Student.findByIdAndDelete(req.params.id); cache.flushAll(); res.redirect('/students?deleted=1'); } catch (err) { next(err); }
});
module.exports = router;
