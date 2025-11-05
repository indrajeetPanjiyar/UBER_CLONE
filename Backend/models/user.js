const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            require: true,
            minLength: [3, "First name must be atleast of 3 characters"],
        },
        lastname: {
            type: String,
            minLength: [3, "Last name must be atleast of 3 characters"],
        }
    },
    email: {
        type: String,
        require: true,
        unique: true,
        minLength: [5, "Email must be atleast of 3 characters"],
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {_id: this._id},
        process.env.JWT_SECRET,
        {expiresIn: '24h'},
    );
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);    
}

module.exports = mongoose.model('user', userSchema);