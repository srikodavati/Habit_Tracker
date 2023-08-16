const User = require('../models/user.js');

// const ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (router) {
  const usersRoute = router.route('/users');
  const userRoute = router.route('/users/:email');

  // ------------ USERS ROUTE ------------

  usersRoute.get(async function (req, res) {
    try {
      const users = await User.find({});
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  usersRoute.post(async function (req, res) {
    try {
      const userName = req.body.userName;
      const email = req.body.email;
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        res.status(409).json({
          message: 'ERROR: User with email already exists!',
        });
        return;
      }

      const newUser = new User({
        userName: userName,
        email: email,
      });

      await newUser.save();
      const createdUser = await User.findOne({ email: email });
      res.status(201).json({ message: 'OK: Created user!', data: createdUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'ERROR: Unknown error occurred.', data: {} });
    }
  });

  // ------------ USER ROUTE ------------

  userRoute.get(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        res.json({
          user,
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  router.route('/users/username/:username').get(async function (req, res) {
    try {
      const email = req.params.username;
      const user = await User.findOne({ userName: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        res.json({
          user,
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  return router;
};
