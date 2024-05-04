// Import Mongoose
const mongoose = require('mongoose');

// Define FeeCategory schema
const StudentFeeProfileSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    feeStructures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' }],
    payments: [{
        amount: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        feeType: { type: String, required: true }
        // Add any additional fields as needed
    }],
    // Add any additional fields as needed
});

module.exports = mongoose.model('StudentFeeProfile', StudentFeeProfileSchema);
