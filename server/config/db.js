const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://divyanshudugar0508:sAF1pzNtLnwSJ0vL@web-development.1nggs.mongodb.net/user-data?retryWrites=true&w=majority&appName=web-development', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
