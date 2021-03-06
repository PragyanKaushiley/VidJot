const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//load helper
const {ensureAuthenticated} = require('../helpers/auth');

//load idea model
require('../models/Ideas');
const Idea = mongoose .model('ideas')


//Idea Index Page
router.get('/',ensureAuthenticated, (req,res) => {
  Idea.find({user: req.user.id})
  .sort({date: 'desc'})
  .then( ideas => {
        res.render('ideas/index', {
          ideas: ideas
        })
    })
});

//Add idea
router.get('/add',ensureAuthenticated, (req,res) => {
  res.render('ideas/add');
});

//Edit idea
router.get('/edit/:id',ensureAuthenticated, (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not authorized');
      res.redirect('/ideas');
    }else{
    res.render('ideas/edit', {
      idea:idea
    });
  }
  });
});


//process Ideas
router.post('/add',ensureAuthenticated, (req,res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    const newUser = {
      title: req.body.title,
      details: req.body.details,
       user: req.user.id
    }
    new Idea(newUser)
    .save()
    .then( idea => {
      req.flash('success_msg', 'Video idea added');
      res.redirect('/ideas');
    })
  }
});

//Edit form process
router.put('/:id',ensureAuthenticated, (req,res) => {
  // res.send('PUT')
  Idea.findOne({
    _id: req.params.id
  })
  .then( idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash('success_msg', 'Video idea edited');
      res.redirect('/ideas');
    })
  })
});

//delete idea
router.delete('/:id',ensureAuthenticated, (req,res) => {
  // res.send('DELETE');
  Idea.remove({_id: req.params.id})
  .then(()=> {
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/ideas');
  });
});


module.exports = router;
