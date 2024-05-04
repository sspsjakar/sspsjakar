const mongoose = require('mongoose');

// Define the schema for student
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,

  },
  phoneNumber: {
    type: String,
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class' // Reference to the Class model
  },
  section: {
    type: String,

  }
  // You can add more fields like attendance, grades, etc. here
}, { timestamps: true });

// Create a model from the schema
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
