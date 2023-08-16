const User = require('../models/user.js');

module.exports = function (router) {
  const habitsRoute = router.route('/users/:email/habits');

  // ------------ HABITS ROUTE ------------

  habitsRoute.get(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.json({
          message: 'User not found',
        });
      }
      const habits = user.habits;
      res.json({ habits });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'ERROR: Unknown error occurred.', data: {} });
    }
  });

  habitsRoute.post(async function (req, res) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      const newHabitName = req.body.name;
      const existingHabit = await User.findOne({
        email: email,
        habits: { $elemMatch: { name: newHabitName } },
      });
      if (existingHabit) {
        return res.status(409).json({ message: 'Habit already exists!' });
      }
      newHabit = {
        name: newHabitName,
        colour: req.body.colour,
        type: req.body.type,
        state: {},
      };
      await User.updateOne({ email: email }, { $push: { habits: newHabit } });
      const updatedUser = await User.findOne({ email: email });
      return res.json({
        message: 'New habit succesfully added!',
        data: updatedUser,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  // ------------ HABIT ROUTE ------------

  const habitRoute = router.route('/users/:email/habits/:habitName');

  habitRoute.put(async function (req, res) {
    try {
      const email = req.params.email;
      const existingHabitName = req.params.habitName;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'ERROR: User not found!' });
      }
      const existingHabit = await User.findOne({
        email: email,
        habits: { $elemMatch: { name: existingHabitName } },
      });
      if (!existingHabit) {
        return res.status(404).json({ message: 'Habit does not exist!' });
      }
      const newName = req.body.name;
      
      if (!newName) {
        return res.json({ message: 'ERROR: Name is required!' });
      }
      var foundIndex = existingHabit['habits'].findIndex(
        (x) => x.name == existingHabitName
      );

      const newColour = req.body.colour ? req.body.colour : existingHabit['habits'][foundIndex]['colour'];
      const newStateDate = req.body.stateDate;
      const newState = req.body.state;
      if (newState !== null && newStateDate) {
        existingHabit['habits'][foundIndex]['state'][newStateDate] = newState;
      }

      const modifiedHabit = {
        name: newName,
        colour: newColour,
        type: existingHabit['habits'][foundIndex]['type'],
        state: existingHabit['habits'][foundIndex]['state'],
      };
      existingHabit['habits'][foundIndex] = modifiedHabit;
      await User.updateOne(
        { email: email },
        { habits: existingHabit['habits'] }
      );
      const replacedHabits = await User.findOne({ email: email });
      res.json({
        message: 'Habit details succesfully changed',
        data: replacedHabits,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  habitRoute.delete(async function (req, res) {
    try {
      const email = req.params.email;
      const existingHabitName = req.params.habitName;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          message: 'ERROR: User not found!',
        });
      } else {
        const existingHabit = await User.findOne({
          email: email,
          habits: { $elemMatch: { name: existingHabitName }}, 
        });
        if (!existingHabit) {
          return res.status(409).json({ message: 'Habit does not exist!' });
        }
        var foundIndex = existingHabit['habits'].findIndex(
          (x) => x.name == existingHabitName
        );
        existingHabit['habits'].splice(foundIndex, 1);
        await User.updateOne(
          { email: email },
          { habits: existingHabit['habits'] }
        );
        const replacedHabits = await User.findOne({ email: email });
        res.json({
          message: 'Habit deleted',
          data: replacedHabits,
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'ERROR: Unknown error occurred.' });
    }
  });

  return router;
};
