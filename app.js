
const express = require('express');
const moment = require('moment');
const business = require('./business.js');
const app = express();
const unwantedKeyList = ['_id'];
var errMessage = '';
var errResponse = { code: 0, msg: errMessage };
const PORT = process.env.PORT || 3000;

var server = app.listen(80, '0.0.0.0');

//Middlewares
app.use(express.json());
app.use(function (error, req, res, next) {
    //Catch json parse error
    if (!!error) {
        errMessage = 'Please send proper JSON data.';
        errResponse = { code: 400, msg: errMessage }
        res.status(400).send(JSON.stringify(errResponse));
    } else {
        next();
    }
});
app.use(checkRequestMiddleware);


//Fetch Records.
app.post('/getir', (req, res) => {
    business.fetchRecords(req.body).then((records => {
        const SuccessObject = { code: 0, msg: 'Success', records };
        res.status(200).send(JSON.stringify(SuccessObject, replacer));
    })).catch((err) => {
        //500 Internal Server Error
        errMessage = 'Database Error';
        errResponse = { code: 500, msg: errMessage }
        res.status(500).send(JSON.stringify(errResponse));
    })
})


//Get restrict.
app.get('*/*', (req, res) => {
    errMessage = 'Only POST request allowed.';
    errResponse = { code: 400, msg: errMessage }
    res.status(400).send(JSON.stringify(errResponse));
})


//Checks request fields.
function checkRequestMiddleware(req, res, next) {

    if (!!req && !!req.body &&
        !!req.body.startDate && (typeof req.body.startDate === 'string') && moment(req.body.startDate, "YYYY-MM-DD", true).isValid() &&
        !!req.body.endDate && (typeof req.body.endDate === 'string') && moment(req.body.endDate, "YYYY-MM-DD", true).isValid() &&
        !!req.body.minCount && (typeof req.body.minCount === 'number') &&
        !!req.body.maxCount && !!(typeof req.body.maxCount === 'number') &&
        req.body.minCount <= req.body.maxCount &&
        moment(req.body.startDate, "YYYY-MM-DD", true) < moment(req.body.endDate, "YYYY-MM-DD", true)) {

        next();
    } else {
        errMessage = 'Bad Request Data';
        errResponse = { code: 400, msg: errMessage }
        res.status(400).send(JSON.stringify(errResponse));

    }







}


//Utils

//Removes unwanted fields in JSON data.
function replacer(key, value) {
    let returnValue = value;
    unwantedKeyList.forEach(unwantedKey => {
        if (key == unwantedKey) returnValue = undefined;
    });
    return returnValue;
}

module.exports = { checkRequestMiddleware: checkRequestMiddleware, server: server }