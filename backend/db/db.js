const mongoose = require('mongoose');
const DB_NAME = "UBER-Clone";
async function connectToDb() {
    // mongoose.connect(process.env.DB_CONNECT)
    // .then(() => console.log('Connected to MongoDB'))
    // .catch(err => console.error('MongoDB connection error:', err));

    try{
        const connectionInstance= await mongoose.connect(`${process.env.DB_CONNECT}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }catch(err){
        console.log("!!MONGODB connection FAILED!!: ", err);
        process.exit(1);
    }
}

module.exports = connectToDb;
