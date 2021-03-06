import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

userSchema.pre('save', function(next) {
    const user: any = this;
    bcrypt.genSalt(10, function(error, salt) {
        if(error) return next(error);
        bcrypt.hash(user.password, salt, null, function(error, hash) {
            if(error) return next(error);
            user.password = hash;
            next();
        }); 
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if(error) return callback(error);
        callback(null, isMatch);
    });
}

const User = mongoose.model('User', userSchema);
export default User;