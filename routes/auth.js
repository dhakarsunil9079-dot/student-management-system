const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const { guestOnly } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const router = express.Router();

router.get('/register', guestOnly, (req, res) => res.render('register', { title: 'Create account' }));
router.post('/register', guestOnly,
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must contain 2–80 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  handleValidation, async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email })) return res.render('register', { title: 'Create account', error: 'An account with this email already exists.' });
      const user = await User.create({ name, email, password });
      req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.redirect('/dashboard');
    } catch (err) { next(err); }
  }
);
router.get('/login', guestOnly, (req, res) => res.render('login', { title: 'Sign in' }));
router.post('/login', guestOnly, body('email').isEmail(), body('password').notEmpty(), handleValidation, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).render('login', { title: 'Sign in', error: 'Email or password is incorrect.' });
    req.session.regenerate(err => {
      if (err) return next(err);
      req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      const target = req.session.returnTo || '/dashboard';
      delete req.session.returnTo;
      res.redirect(target);
    });
  } catch (err) { next(err); }
});
router.post('/logout', (req, res, next) => req.session.destroy(err => err ? next(err) : res.redirect('/')));
module.exports = router;
