const bcrypt = require('bcrypt');
const Student = require('../models/student.js');
const StudentFeeProfile = require("../models/fees/studentFeeProfile.js")
const { randomNumber, randomString, generateUsername, generatePassword } = require('../utils/generators.js');

const Parent = require('../models/parent.js');

exports.addStudent = async (req, res) => {
    const { firstName, lastName, dateOfBirth, gender, address, email, phoneNumber, classId, feeStructures, section } = req.body;

    try {
        // Create a new student
        const newStudent = new Student({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            address,
            email,
            phoneNumber,
            class: classId,
            section
        });
        const savedStudent = await newStudent.save();

        // Create a fee profile for the student and associate fee structures
        const newFeeProfile = new StudentFeeProfile({
            studentId: savedStudent._id,
            feeStructures: feeStructures, // Associate selected fee structures
            payments: []
        });
        await newFeeProfile.save();

        // Create a parent for the student
        const parentUsername = generateUsername(firstName, lastName); // Generate username using student's name
        let random = randomNumber(99999, 999999)
        const parentPassword = random.toString(); // Generate a random password

        const hashedPassword = await bcrypt.hash(parentPassword, 10);

        const newParent = new Parent({
            username: parentUsername,
            password: hashedPassword,
            
            // Add other relevant parent information here
        });

        // Associate the new student with the parent
        newParent.students.push(savedStudent._id);

        // Save the parent to the database
        await newParent.save();

        res.status(201).json({
            message: 'Student and Parent created successfully',
            result: { student: savedStudent, parent: { username: parentUsername, password: parentPassword } }
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getStudents = async (req, res) => {
    try {
        // Fetch all students
        const students = await Student.find().populate('class');
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        // Fetch student by ID
        const student = await Student.findById(studentId).populate('class');;
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const { firstName, lastName, dateOfBirth, gender, address, email, phoneNumber, classId } = req.body;
    try {
        // Check if student exists
        let student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student fields
        student.firstName = firstName || student.firstName;
        student.lastName = lastName || student.lastName;
        student.dateOfBirth = dateOfBirth || student.dateOfBirth;
        student.gender = gender || student.gender;
        student.address = address || student.address;
        student.email = email || student.email;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        student.class = classId || student.class;

        // Save updated student
        await student.save();

        res.status(200).json({ message: 'Student updated successfully', result: student });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteStudent = async (req, res) => {
    const studentId = req.params.id;
    try {
        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete student
        await student.deleteOne();

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getStudentsByClass = async (req, res) => {
    console.log("Request came");
    const classId = req.params.classId;
    try {
        // Fetch students by class ID
        const students = await Student.find({ class: classId });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByClassAndSection = async (req, res) => {
    console.log("Request came");
    const { classId, section } = req.params;
    try {
        // Fetch students by class ID and section
        const students = await Student.find({ class: classId, section: section });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class and section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByQuery = async (req, res) => {
    const query = req.query;
    try {
        // Fetch students by custom query
        const students = await Student.find(query);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by query:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStudentsByClassOrSection = async (req, res) => {
    const { classId, section } = req.params;

    try {
        let query = { class: classId };

        // Check if section is provided
        if (section) {
            query.section = section;
        }

        // Fetch students based on the constructed query
        const students = await Student.find(query).populate('class');;

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class or section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
