require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const Student = require('./models/Student');
const cache = require('./utils/cache');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET) throw new Error('Set MONGODB_URI and SESSION_SECRET in .env');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: Number(process.env.SESSION_MAX_AGE_DAYS || 7) * 86400000 }
}));
app.use((req,res,next)=>{res.locals.currentUser=req.session.user||null;res.locals.error=null;res.locals.notice=req.query.created?'Student added successfully.':req.query.updated?'Student updated successfully.':req.query.deleted?'Student deleted successfully.':null;res.locals.formError=req.session.formError||null;res.locals.formValues=req.session.formValues||{};delete req.session.formError;delete req.session.formValues;next();});
const authLimiter = rateLimit({ windowMs: 15*60*1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: 'Too many attempts. Please try again later.' });
app.use('/', authLimiter, authRoutes);
app.get('/', (req,res)=>res.render('home',{title:'Student Management System'}));
app.get('/dashboard', (req,res)=>res.redirect('/students'));
app.use('/students', studentRoutes);
app.use('/api', rateLimit({windowMs:60*1000,limit:100,standardHeaders:'draft-7',legacyHeaders:false}), apiRoutes);
app.get('/health', (req,res)=>res.json({status:'ok',uptime:process.uptime()}));
app.use((req,res)=>res.status(404).render('404',{title:'Page not found'}));
app.use((err,req,res,next)=>{console.error(err);if(req.originalUrl.startsWith('/api/'))return res.status(500).json({message:'Something went wrong. Please try again.'});res.status(500).render('500',{title:'Server error'});});

// Background maintenance task: clear stale in-memory cached values every night.
cron.schedule('0 2 * * *',()=>{cache.flushAll();console.log('[job] Application cache cleared');});

mongoose.connect(process.env.MONGODB_URI).then(()=>{
  app.listen(PORT,()=>console.log(`Cognifyz Student Management System running at http://localhost:${PORT}`));
}).catch(err=>{console.error('MongoDB connection failed:',err.message);process.exit(1);});
