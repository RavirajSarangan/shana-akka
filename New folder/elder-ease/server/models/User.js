const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Elder', 'Family Member', 'Admin'],
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    preferences: {
        language: {
            type: String,
            enum: ['English', 'Sinhala', 'Tamil'],
            default: 'English'
        },
        accessibility: {
            highContrast: { type: Boolean, default: false },
            fontSize: { type: String, enum: ['Normal', 'Large', 'Extra Large'], default: 'Normal' },
            screenReader: { type: Boolean, default: false }
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Deactivated'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
