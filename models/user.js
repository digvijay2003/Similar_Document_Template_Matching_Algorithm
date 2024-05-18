const argon2 = require('argon2');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         const hashedPassword = await argon2.hash(this.password);
//         this.password = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        return await argon2.verify(this.password, enteredPassword);
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);
