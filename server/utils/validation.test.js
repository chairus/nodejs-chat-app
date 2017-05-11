const expect = require('expect');
const { isRealString } = require('./validation');

describe("isRealString", () => {
    it("should reject non-string values", () => {
        var str1 = '';
        var str2 = 44342;
        var result1 = isRealString(str1);
        var result2 = isRealString(str2)

        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });

    it("should reject string with only space", () => {
        var str = '              ';
        var result = isRealString(str);

        expect(result).toBe(false);
    })

    it("should allow string with non-space characters", () => {
        var str = 'Victoria Sun';
        var result = isRealString(str);

        expect(result).toBe(true);
    })
});
