// settings and budget types endpoints (for now) will be located here 

const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

/***
 * Settings 
 */
router.get('/settings', auth, (req, res) => {

    
});

/****
 * Budget Types 
 */

router.post('/types', auth, (req, res) => {

 });

router.get('/types', auth, (req, res) => {

 });

router.get('/types/:id', auth, (req, res) => {

}); 

router.patch('/types', auth, (req, res) => {

});