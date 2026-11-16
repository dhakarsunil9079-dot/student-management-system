const { validationResult } = require('express-validator');
exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(e => e.msg).join(' ');
    if (req.originalUrl.startsWith('/api/')) return res.status(422).json({ message, errors: errors.array() });
    req.session.formError = message;
    req.session.formValues = req.body;
    return res.redirect('back');
  }
  next();
};
