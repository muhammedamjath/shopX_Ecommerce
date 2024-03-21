const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOADDRESS)
.then(()=>console.log('mongodb  connected   sidesuccessfull'))
.catch(()=> console.log('mongodb not connected'))

module.exports=mongoose 