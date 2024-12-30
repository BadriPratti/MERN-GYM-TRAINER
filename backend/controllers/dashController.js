const Trainer = require('../models/trainerModel');
const Trainee = require('../models/traineeModel');

// Fetch all trainers
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    if (!trainers || trainers.length === 0) {
      return res.status(404).json({ message: 'No trainers found' });
    }
    res.status(200).json({ trainers });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all trainees
const getTrainees = async (req, res) => {
  try {
    const trainees = await Trainee.find();
    if (!trainees || trainees.length === 0) {
      return res.status(404).json({ message: 'No trainees found' });
    }
    res.status(200).json({ trainees });
  } catch (error) {
    console.error('Error fetching trainees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getTrainers, getTrainees };