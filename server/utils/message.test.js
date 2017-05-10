var expect = require('expect');
var { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
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

describe('generateLocationMessage', () => {
    it('should generate the correct location object', () => {
        var from = 'victoria_sun@example.com';
        var lat = -35;
        var lng = -143;
        var url = `https://www.google.com/maps?q=${lat},${lng}`;
        var locMsg = generateLocationMessage(from, lat, lng);

        expect(locMsg).toInclude({
            from,
            url
        });
        expect(locMsg.createdAt).toExist();

    });
});
