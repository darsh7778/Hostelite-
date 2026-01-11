const User = require("../models/User"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing" });

        const { name, email, password, role } = req.body;

    
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "student", 
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing" });

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
