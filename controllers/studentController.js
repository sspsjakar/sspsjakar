const bcrypt = require('bcrypt');
const Student = require('../models/student.js');
const StudentFeeProfile = require("../models/fees/studentFeeProfile.js")



exports.addStudent = async (req, res) => {
    
    const {
        admission_Number,
        roll_Number,
        first_Name,
        last_Name,
        date_Of_Birth,
        gender,
        permanent_Address,
        address_For_Correspondence,
        contact_Number,
        alternet_Contact_Number,
        email,
        nationality,
        religion,
        category,
        date_Of_Admission,
        blood_Group,
        father_Name,
        father_Occupation,
        mother_Name,
        mother_Occupation,
        student_Photo,
        aadhar_number,
        due_amount,
        class_Id,
        section,
        session,
        feeStructures
    } = req.body;

    try {
        // Create a new student
        const newStudent = new Student({
            admission_Number,
            roll_Number,
            first_Name,
            last_Name,
            date_Of_Birth,
            gender,
            permanent_Address,
            address_For_Correspondence,
            contact_Number,
            alternet_Contact_Number,
            email,
            nationality,
            religion,
            category,
            date_Of_Admission,
            blood_Group,
            father_Name,
            father_Occupation,
            mother_Name,
            mother_Occupation,
            student_Photo,
            aadhar_number,
            due_amount,
            class_Id,
            section,
            session
        });

        const savedStudent = await newStudent.save();

        // Create a fee profile for the student and associate fee structures
        const newFeeProfile = new StudentFeeProfile({
            studentId: savedStudent._id,
            feeStructures: feeStructures, // Associate selected fee structures
            payments: []
        });
        await newFeeProfile.save();


        res.status(201).json({
            message: 'Student and Parent created successfully',
            result: savedStudent
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudents = async (req, res) => {
    try {
        // Fetch all students
        const students = await Student.find().populate('class_Id');
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
        const student = await Student.findById(studentId).populate('class_Id');;
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
    const updateFields = req.body;

    try {
        // Check if student exists
        let student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student fields
        for (let key in updateFields) {
            if (updateFields.hasOwnProperty(key)) {
                student[key] = updateFields[key];
            }
        }

        // Save updated student
        const updatedStudent = await student.save();

        // Update student fee profile if fee structures are provided
        if (updateFields.hasOwnProperty('feeStructures')) {
            const studentFeeProfile = await StudentFeeProfile.findOne({ studentId });
            if (studentFeeProfile) {
                studentFeeProfile.feeStructures = updateFields['feeStructures'];
                await studentFeeProfile.save();
            }
        }

        res.status(200).json({ message: 'Student updated successfully', result: updatedStudent });
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
        let query = { class_Id: classId };

        // Check if section is provided
        if (section) {
            query.section = section;
        }

        // Fetch students based on the constructed query
        const students = await Student.find(query).populate('class_Id');;

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class or section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
