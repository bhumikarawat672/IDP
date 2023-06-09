import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const user = mongoose.model('user', userSchema);

export default user;
