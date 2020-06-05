const model = require('./model');
const database = require('./database.js');

let fetchRecords = function (request) {
    return new Promise((resolve, reject) => {


        database.startConnection().then((connection => {
            //Connection success.
            //Records calling.
            model.aggregate([
                {
                    "$addFields": {
                        "totalCount": {
                            "$reduce": {
                                "input": "$counts",
                                "initialValue": 0,
                                "in": { "$add": ["$$value", "$$this"] }
                            }
                        }
                    }
                },
                { "$match": { createdAt: { $gt: new Date(Date.parse(request.body.startDate)), $lt: new Date(Date.parse(request.body.endDate)) }, totalCount: { $gt: request.body.minCount, $lt: request.body.maxCount } } },

                { "$project": { "key": "$key", "createdAt": "$createdAt", "totalCount": "$totalCount", } }

            ]).exec((err, records) => {
                console.log('2')
                database.closeConnection();

                if (!!err) {
                    reject(err);
                } else {

                    resolve(records);
                }


            });
        })).catch((err) => {
            //Connection failed..
            database.closeConnection();
            reject(err)

        })


    });
}



module.exports = { fetchRecords };