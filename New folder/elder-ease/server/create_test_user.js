const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existing = await User.findOne({ email: 'family@test.com' });
        if (existing) {
            console.log('Test family user already exists.');
        } else {
            const user = new User({
                name: 'Test Family',
                email: 'family@test.com',
                password: 'password123',
                role: 'Family Member'
            });
            await user.save();
            console.log('✅ Test Family Member created: family@test.com / password123');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestUser();
