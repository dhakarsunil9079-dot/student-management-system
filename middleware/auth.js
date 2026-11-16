exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    if (req.originalUrl.startsWith('/api/')) return res.status(401).json({ message: 'Please sign in.' });
    req.session.returnTo = req.originalUrl;
    req.flashMessage = 'Please sign in to continue.';
    return res.redirect('/login');
  }
  next();
};
exports.guestOnly = (req, res, next) => req.session.user ? res.redirect('/dashboard') : next();
