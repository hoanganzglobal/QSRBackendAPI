const mongoose = require('mongoose');
require('dotenv/config');

class Database {    
    connect() {
        mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            dbName: 'QSRBackend'
        })
        .then(() => {
            console.log("Database connection successful!");
        })
        .catch((err) => {
            console.log("Database connection error " + err);
        })
    }

    MssqlConnect() {
        
    }
}

module.exports = new Database();