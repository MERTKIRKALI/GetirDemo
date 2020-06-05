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

test('Checks request with good request', () => {
    let res = { status: jest.fn() }, next = jest.fn();
    app.checkRequestMiddleware(goodRequest, res, next);
    expect(next).toHaveBeenCalled();

})

test('Checks request with bad request.', () => {
    let res = {
        status: jest.fn((status => {
            let send = { send: jest.fn() };
            return send;
        }))
    }, next = jest.fn();
    app.checkRequestMiddleware(badRequest, res, next);
    expect(next).not.toHaveBeenCalled();

})



it('Fetch records with good request', () => {
    expect.assertions(1);
    return business.fetchRecords(goodRequest.body).then(data => expect(data.length).toBeGreaterThan(0));
});

it('Fetch records with bad request', () => {
    expect.assertions(1);
    return business.fetchRecords(badRequest.body).then(data => expect(data.length).toEqual(0));
});

const PORT = process.env.PORT || 3000;

beforeEach(() => {
    if (app.server.listening)
        app.server.close();

    app.server.listen(PORT);
});

afterEach(() => {
    app.server.close();
});



