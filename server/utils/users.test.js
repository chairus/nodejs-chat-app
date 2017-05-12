const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    var users = new Users();

    beforeEach(() => {
        users.users = [
            {
                id: '456',
                name: 'Girth',
                room: 'Naruto Fans'
            }, {
                id: '88',
                name: 'Jakow',
                room: 'Russia Fans'
            }, {
                id: '9',
                name: 'Konohamaru',
                room: 'Naruto Fans'
            }, {
                id: '1',
                name: 'Sakura',
                room: 'Sasuke Fans'
            }
        ]
    });

    it('should add new user', () => {
        var user = {
            id: '123',
            name: 'Mike',
            room: 'Naruto Fans'
        }

        var newUser = users.addUser(user.id, user.name, user.room);

        expect(users.users.length).toBe(5);
        expect(users.users).toInclude(user);
    });

    it('should return names of \'Naruto Fans\'', () => {
        var nameList = users.getUserList('Naruto Fans');

        expect(nameList.length).toBe(2);
        expect(nameList).toEqual(['Girth', 'Konohamaru']);
    });

    it('should return the name of a user with the specific id', () => {
        var user = users.getUser('88');

        expect(user).toEqual({id: '88', name: 'Jakow', room: 'Russia Fans'});
    });

    it('should not return the name of a user not in the \'users\' array', () => {
        var user = users.getUser('23545');

        expect(user).toNotExist();
    });

    it('should remove a user with the specific id', () => {
        var user = users.removeUser('456');

        expect(users.users.length).toBe(3);
        expect(users.users).toNotInclude({id: '456', name: 'Girth', room: 'Naruto Fans'});
    });

    it('should not remove a user with the wrong id', () => {
        var user = users.removeUser('42545');

        expect(users.users.length).toBe(4);
        expect(user).toNotExist();
    });

    it('should return the list of created rooms', () => {
        var rooms = users.getRoomList();

        expect(rooms).toEqual(['Naruto Fans', 'Russia Fans', 'Sasuke Fans']);
    });
})
