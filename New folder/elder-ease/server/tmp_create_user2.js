const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

(async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'family2@test.com';
    let user = await User.findOne({email});
    if(user){
      user.status = 'Active';
      user.password = 'password123';
      user.role = 'Family Member';
      user.name = 'Test Family 2';
      await user.save();
      console.log('Updated existing user', email);
    } else {
      user = new User({name:'Test Family 2', email, password:'password123', role:'Family Member', status:'Active'});
      await user.save();
      console.log('Created user', email);
    }
    process.exit(0);
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();
