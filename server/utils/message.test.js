var expect = require('expect');
var { generateMessage } = require('./message')

describe('message generator', () => {
    it('should generate the correct message', () => {
        var from = 'christal@example.com';
        var text = 'Hello! Babe!';
        var msg = generateMessage(from, text);

        expect(msg).toInclude({
            from,
            text
        });

        expect(msg.createdAt).toExist();
    });
});
