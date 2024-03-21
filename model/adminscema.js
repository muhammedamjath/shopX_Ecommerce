const mongoose = require('mongoose');


const adminCollection = mongoose.connection.collection('adminCollection');
module.exports=adminCollection