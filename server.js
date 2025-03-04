const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
})

// ✅ Handle MySQL connection errors
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1); // Exit the process if DB connection fails
    }
    console.log("Connected to MySQL database");
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });


// ✅ Fetch all users (excluding soft-deleted users)
app.get("/", (req,res) =>{
    const sql = "SELECT * FROM student";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// ✅ Create a new user with image upload
app.post('/create', upload.single('image'), (req, res) => {
    console.log("Received Request:", req.body); // Debugging

    const { name, phone, email, address, gender } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !phone || !email || !address || !gender) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const sql = "INSERT INTO student (name, phone, email, address, gender, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, phone, email, address, gender, image], (err, result) => {
        if (err) {
            console.error("Database Insert Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "User added successfully!" });
    });
});


app.put('/update/:id', upload.single('image'), (req, res) => {
    console.log("Received Update Request:", req.body); // Debugging

    const { name, phone, email, address, gender } = req.body;
    const id = req.params.id;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Get uploaded image path

    let sql, values;
    if (image) {
        sql = "UPDATE student SET `name` = ?, `phone` = ?, `email` = ?, `address` = ?,`gender` = ?, `image` = ? WHERE `id` = ?";
        values = [name, phone, email, address, gender, image, id];
    } else {
        sql = "UPDATE student SET `name` = ?, `phone` = ?, `email` = ?, `address` = ?, `gender` = ? WHERE `id` = ?";
        values = [name, phone, email, address, gender, id];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ message: "Database update error" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully!" });
    });
});

app.get('/update/:id', (req, res) => {
    const sql = "SELECT * FROM student WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database Error", error: err });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Ensure correct image path
        if (data[0].image) {
            data[0].image = `http://localhost:8081${data[0].image}`;
        }

        return res.json(data[0]); // Send the first user object
    });
});


// ✅ Soft delete a user (mark as deleted)
app.put("/delete/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "UPDATE student SET isDeleted = 1 WHERE id = ?";
    
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("SQL ERROR:", err.sqlMessage);
            return res.status(500).json({ message: "Database error", error: err.sqlMessage });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }

        return res.json({ message: `User ID ${userId} marked as deleted` });
    });
});

app.listen(8081, () =>{
    console.log("Listening..")
})

