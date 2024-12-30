const mongoose = require('mongoose');

const traineeSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  hasTrainer: { type: Boolean, default: false },
  trainerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  idealRate: { type: String },
  lastName: { type: String, required: true },
  locationPref: { type: String },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  timings: { type: String },
  userName: { type: String, required: true },
  workoutType: { type: String, enum: ['Cardio', 'Calisthenics', 'Bodybuilding', 'Powerlifting', 'Crossfit']}, // fill in other types
  dateCreated: { type: Date, default: Date.now },
  dateLastLoggedIn: { type: Date, default: Date.now },
});

const Trainee = mongoose.model('Trainee', traineeSchema);
module.exports = Trainee;