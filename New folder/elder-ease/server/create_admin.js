const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = 'admin123@gmail.com';
        const password = 'admin123';

        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`User with email ${email} already exists. Updating role and password...`);
            existing.role = 'Admin';
            existing.password = password; // The Model middleware hashes this automatically normally, but we ensure promptness
            await existing.save();
            console.log(`✅ Admin user updated: ${email} / ${password}`);
        } else {
            const user = new User({
                name: 'System Admin',
                email: email,
                password: password,
                role: 'Admin'
            });
            await user.save();
            console.log(`✅ Admin user created: ${email} / ${password}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdminUser();
