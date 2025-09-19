const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(() => console.log("connected to the database!"))
            ;
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB