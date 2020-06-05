const app = require('./../app');
const business = require('./../business');
const goodRequest = {
    body: {
        "startDate": "2000-01-01",
        "endDate": "2016-08-01",
        "minCount": 1,
        "maxCount": 3000
    }
}

const badRequest = {
    body: {
        "startDate": "2017-01-01",
        "endDate": "2016-08-01",
        "minCount": 1,
        "maxCount": 3000
    }
}

test('Checks request', () => {
    let res = { status: jest.fn() }, next = jest.fn();
    app.checkRequestMiddleware(goodRequest, res, next);
    expect(next).toHaveBeenCalled();

})



it('Fetch records', () => {
    expect.assertions(1);
    return business.fetchRecords(goodRequest.body).then(data => expect(data.length).toBeGreaterThan(0));
});



beforeEach(() => {
    if (app.server.listening)
        app.server.close();

    app.server.listen(3000);
});

afterEach(() => {
    app.server.close();
});



