var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userName: String,
    email: String,
    habits: [],
    friends: [],  //contains email id of friends
  },
  // { typeKey: '$type'},
);

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
