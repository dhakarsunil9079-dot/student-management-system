const express = require('express');
const { body, param } = require('express-validator');
const Student = require('../models/Student');
const cache = require('../utils/cache');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const router = express.Router();
router.use(requireAuth);
const fields = [body('name').trim().isLength({min:2,max:80}), body('email').isEmail(), body('course').trim().notEmpty(), body('enrollmentNo').trim().isLength({min:3,max:30}), body('status').optional().isIn(['Active','Inactive'])];
router.get('/students', async (req,res,next) => {
  try { const key = 'students:list'; let data = cache.get(key); if (!data) { data = await Student.find().sort({createdAt:-1}).limit(200).lean(); cache.set(key,data); } res.json({count:data.length,data}); } catch(e){next(e);}
});
router.get('/students/:id', param('id').isMongoId(), handleValidation, async(req,res,next)=>{try{const item=await Student.findById(req.params.id).lean(); if(!item)return res.status(404).json({message:'Student not found'});res.json({data:item});}catch(e){next(e);}});
router.post('/students', fields, handleValidation, async(req,res,next)=>{try{const item=await Student.create({...req.body,createdBy:req.session.user.id});cache.flushAll();res.status(201).json({message:'Student created',data:item});}catch(e){if(e.code===11000)return res.status(409).json({message:'Enrollment number already exists'});next(e);}});
router.put('/students/:id', param('id').isMongoId(), ...fields, handleValidation, async(req,res,next)=>{try{const item=await Student.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({message:'Student not found'});cache.flushAll();res.json({message:'Student updated',data:item});}catch(e){next(e);}});
router.delete('/students/:id', param('id').isMongoId(), handleValidation, async(req,res,next)=>{try{const item=await Student.findByIdAndDelete(req.params.id);if(!item)return res.status(404).json({message:'Student not found'});cache.flushAll();res.json({message:'Student deleted'});}catch(e){next(e);}});
// External API integration demo: fetch a sample post from JSONPlaceholder.
router.get('/external/sample-post', async(req,res,next)=>{try{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),5000);const response=await fetch('https://jsonplaceholder.typicode.com/posts/1',{signal:controller.signal});clearTimeout(timer);if(!response.ok)throw new Error('External service returned an error');res.json({source:'JSONPlaceholder',data:await response.json()});}catch(e){next(e);}});
module.exports=router;
