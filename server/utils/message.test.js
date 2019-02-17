var expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it ('should generate correct message object', () => {
        var from = 'Jen';
        var text = 'Some message';
        // store res in variable
        var message = generateMessage(from, text);
        
        // assert createdAt is number
        expect(message.createdAt).toBeA('number');

        // assert from match
        // assert text match
        expect(message).toInclude({from, text});
    });
});

describe('generateLocationMessage', () => {
    it ('should generate correct location object', () => {
        var from = 'Deb';
        var latitude = 15;
        var longitude = 19;
        var url = 'https://www.google.com/maps?q=15,19';
        var message = generateLocationMessage(from, latitude, longitude);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});