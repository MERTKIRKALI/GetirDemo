const mongoose = require('mongoose');


let startConnection = function () {
    return mongoose.connection.openUri('mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
};

let closeConnection = function () {
    mongoose.disconnect();
}




module.exports = { startConnection, closeConnection };

