const bcrypt = require('bcryptjs');
const Trainer = require('../models/trainerModel');
const Trainee = require('../models/traineeModel');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        locationPref,
        age,
        workoutType,
        timings,
        idealRate, 
        userType, // 'trainee' or 'trainer'
    } = req.body;

    // Validate input
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !username ||
        !password ||
        !locationPref ||
        !age ||
        !workoutType ||
        !timings ||
        !idealRate ||
        !userType
    ) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if the user already exists in both collections
        const existingTrainee = await Trainee.findOne({ username });
        const existingTrainer = await Trainer.findOne({ username });
        if (existingTrainee || existingTrainer) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register user based on userType
        let newUser;
        if (userType === 'trainee') {
            newUser = new Trainee({
                age,
                email,
                firstName,
                lastName,
                hasTrainer: false, // Default value
                trainerID: null, // No trainer by default
                idealRate, 
                locationPref,
                password: hashedPassword,
                phoneNumber,
                timings,
                userName: username, // Field mapping
                workoutType,
                dateLastLoggedIn: new Date(),
            });
        } else if (userType === 'trainer') {
            newUser = new Trainer({
                age,
                email,
                firstName,
                lastName,
                idealRate,
                locationPref,
                password: hashedPassword,
                phoneNumber,
                timings,
                userName: username, // Field mapping
                workoutType, 
                numTrainees: 0, // Default value
                dateLastLoggedIn: new Date(),
            });
        } else {
            return res.status(400).json({ message: 'Invalid userType selected' });
        }

        // Save the new user
        await newUser.save();

        res.status(201).json({
            message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} registered successfully`,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                userType,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password.' });
    }

    try {
        // Check if user exists in either Trainee or Trainer models
        const user = await Trainee.findOne({userName: username }) || await Trainer.findOne({userName: username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        // Compare password 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // If everything is valid, respond with success message
        res.status(200).json({ message: 'Login successful', user});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const {name, newGym, newWorkoutType, newTimings, newIdealRate } = req.body;

    // Validate input
    if (!newGym || !newWorkoutType || !newTimings || !newIdealRate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Update the user
        const searchByName = name.split(" ")[0];
        const user = await Trainee.findOne({firstName: searchByName}) || await Trainer.findOne({firstName: searchByName});
        console.log('user: ', user);
        // const [newFirstName, newLastName] = newName.split(' ');
        // user.firstName = newFirstName;
        // user.lastName = newLastName;
        user.locationPref = newGym;
        user.workoutType = newWorkoutType;
        user.timings = newTimings;
        user.idealRate = newIdealRate;
        await user.save();

        res.status(200).json({ 
            message: 'User updated successfully', 
            user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user instanceof Trainee ? 'trainee' : 'trainer',
            gym: user.gym,
            workoutType: user.workoutType,
            timings: user.timings,
            idealRate: user.idealRate,
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteUser = async (req, res) => {
    const { name } = req.body;
    console.log('in deleteUser username: ', name);
    const searchByName = name.split(" ")[0];
    // const user = await Trainee.findOne({firstName: searchByName}) || await Trainer.findOne({firstName: searchByName});
    console.log("searchByName: ", searchByName);
    // Validate input
    if (!name) {
        return res.status(400).json({ message: 'Please provide a username.'});
    }
    try{
        const user = await Trainee.findOne({firstName: searchByName}) || await Trainer.findOne({firstName: searchByName});
        if (!user){
                return res.status(404).json({ message: 'User not found.' });
            }
            if (user instanceof Trainee){
                await Trainee.deleteOne({ firstName: searchByName });
            } else if (user instanceof Trainer){
                await Trainer.deleteOne({ firstName: searchByName });
            }
            res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error){
        console.error( 'Error occurred while deleting user.' );
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };
