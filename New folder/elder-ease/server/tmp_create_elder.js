const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

(async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'elder1@test.com';
    let user = await User.findOne({email});
    if(user){
      user.status = 'Active';
      user.password = 'password123';
      user.role = 'Elder';
      user.name = 'Test Elder 1';
      await user.save();
      console.log('Updated existing elder', email);
    } else {
      user = new User({name:'Test Elder 1', email, password:'password123', role:'Elder', status:'Active'});
      await user.save();
      console.log('Created elder', email);
    }
    process.exit(0);
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();
