//Installed dependencies

const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());


// In-memory data storage
let courses = [];
let users = [];

// Course Model
class Course {
    constructor(id, title, description, instructor, price) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.price = price;
        this.students = [];
    }
}

// User Model
class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // In a real app, this would be hashed
        this.enrolledCourses = [];
    }
}

// Routes

// 1. Create a new course
app.post('/api/courses', (req, res) => {
    const { title, description, instructor, price } = req.body;
    const id = courses.length + 1;
    const newCourse = new Course(id, title, description, instructor, price);
    courses.push(newCourse);
    res.status(201).json(newCourse);
});

// 2. Get all courses
app.get('/api/courses', (req, res) => {
    res.json(courses);
});

// 3. Get a specific course
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
});

// 4. User registration
app.post('/api/users/register', (req, res) => {
    const { name, email, password } = req.body;
    const id = users.length + 1;
    const newUser = new User(id, name, email, password);
    users.push(newUser);
    res.status(201).json({ id, name, email });
});

// 5. Enroll in a course
app.post('/api/courses/:courseId/enroll', (req, res) => {
    const { userId } = req.body;
    const course = courses.find(c => c.id === parseInt(req.params.courseId));
    const user = users.find(u => u.id === userId);

    if (!course || !user) {
        return res.status(404).json({ message: 'Course or user not found' });
    }

    if (user.enrolledCourses.includes(course.id)) {
        return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    user.enrolledCourses.push(course.id);
    course.students.push(userId);
    res.json({ message: 'Enrolled successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});