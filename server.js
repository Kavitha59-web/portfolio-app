
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });

// Contact message schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model("Contact", contactSchema);

// Receive contact form submissions
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        if (
            name.length > 100 ||
            email.length > 254 ||
            message.length > 5000 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Please check your input."
            });
        }

        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        res.status(201).json({
            success: true,
            message: "Your message has been saved successfully.",
            id: contact._id
        });
    } catch (error) {
        console.error("Contact submission failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to save your message. Please try again."
        });
    }
});

// Start server after MongoDB connects
mongoose.connection.once("open", () => {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
