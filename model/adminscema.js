const mongoose = require('mongoose');
const server=require('../model/mongodb')


const adminCollection = mongoose.connection.collection('adminCollection');
module.exports=adminCollection