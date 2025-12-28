const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username là bắt buộc'],
        unique: true,
        trim: true,
        minlength: [3, 'Username phải có ít nhất 3 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Password là bắt buộc'],
        minlength: [6, 'Password phải có ít nhất 6 ký tự'],
        select: false
    },
    fullName: {
        type: String,
        required: [true, 'Họ tên là bắt buộc'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'librarian', 'reader'],
        default: 'reader'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    }
}, {
    timestamps: true
});

// Mã hóa password trước khi lưu
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method để kiểm tra password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method để lấy thông tin user (không bao gồm password)
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);