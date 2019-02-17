var expect = require('expect');

var { generateMessage } = require('./message');

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