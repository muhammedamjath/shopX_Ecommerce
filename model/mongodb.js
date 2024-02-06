const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shades')
.then(()=>console.log('mongodb  connected   sidesuccessfull'))
.catch(()=> console.log('mongodb not connected'))

module.exports=mongoose