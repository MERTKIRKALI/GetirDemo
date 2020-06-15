const mongoose = require('mongoose');


let startConnection = function () {
    return mongoose.connection.openUri(' mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/' + 'getir-case-study?retryWrites=true', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
};

let closeConnection = function () {
    mongoose.disconnect();
}




module.exports = { startConnection, closeConnection };

