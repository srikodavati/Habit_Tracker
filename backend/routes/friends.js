const User = require('../models/user.js');

// const ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (router) {
  // const usersRoute = router.route('/users');
  const friendsRoute = router.route('/users/:email/friends');
  const NotFriendRoute = router.route('/users/:email/notfriends');

  // ------------ USER ROUTE ------------

  //Api to fetch all friends of a user (name and email of friends)
  friendsRoute.get(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        friends_email = user['friends'];
        if (friends_email.length !== 0) {
          let friends_name_email = [];
          let friends_data;

          for (let i = 0; i < friends_email.length; i++) {
            let temp_list = [];
            friends_data = await User.findOne({ email: friends_email[i] });
            temp_list.push(friends_data['email']);
            temp_list.push(friends_data['userName']);

            friends_name_email.push(temp_list);
          }

          res.json({
            friends_name_email,
          });
        } else {
          //friends list empty
          let friends_name_email = [];
          res.json({
            friends_name_email,
          });
        }
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  //API to remove a friends from user's list
  friendsRoute.put(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        await User.updateOne(
          { email: email },
          { $pullAll: { friends: [req.body.friendEmail] } }
        );

        res.json({
          message: 'Unfollowed Friend Successfully',
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  // API to get user who are not friends
  NotFriendRoute.get(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        console.log('else');

        let friends_email = user['friends'];

        console.log(friends_email);
        if (friends_email.length === 0) {
          //if user has no friends then display all
          console.log('if');
          const AllUsers = await User.find({});

          let not_friends_name_email = [];

          for (let i = 0; i < AllUsers.length; i++) {
            let temp_list = [];
            temp_list.push(AllUsers[i]['email']);
            temp_list.push(AllUsers[i]['userName']);

            not_friends_name_email.push(temp_list);
          }

          res.json({
            not_friends_name_email,
          });
        } else {
          console.log('else remove');

          //{"email" : {$nin: ["parth@abc.com", "frn3@illinois.edu" ]}}
          const AllUsers = await User.find({ email: { $nin: friends_email } });

          // console.log(AllUsers)
          let not_friends_name_email = [];

          for (let i = 0; i < AllUsers.length; i++) {
            let temp_list = [];
            temp_list.push(AllUsers[i]['email']);
            temp_list.push(AllUsers[i]['userName']);

            not_friends_name_email.push(temp_list);
          }

          res.json({
            not_friends_name_email,
          });
        }
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  //API to add a friends to user's list
  NotFriendRoute.put(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        await User.updateOne(
          { email: email },
          { $addToSet: { friends: req.body.friendEmail } }
        );

        res.json({
          message: 'Followed Friend Successfully',
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  return router;
};
