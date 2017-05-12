// Each user will have the properties:
// {
//     id,
//     name,
//     room
// }

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // Find the element in the 'users' array
        var index = this.users.findIndex((user) => {
            return id == user.id;
        });
        var removedUser = this.users[index];

        if (index >= 0) {
            // Remove the user in the array
            this.users.splice(index, 1);
        }

        return removedUser;
    }

    getUser(id) {
        var user = this.users.find((user) => {
            return id === user.id;
        })

        return user;
    }

    getUserList(room) {
        var users = this.users.filter((user) => {
            return room === user.room;
        });

        var nameList = users.map((user) => {
            return user.name;
        });

        return nameList;
    }

    getRoomList() {
        return this.users.reduce((rooms, outerCurr) => {
            var dupRoom = rooms.find((innerCurr) => {
                return innerCurr === outerCurr.room
            });
            if (!dupRoom) {
                rooms.push(outerCurr.room);
            }
            return rooms;
        }, []);
    }
}

module.exports = {
    Users
};

// class Person {
//     constructor (name, age) {
//         this.name = name;
//         this.age = age;
//     }
//
//     getUserDescription () {
//         return `${ this.name } is ${ this.age } year(s) old.`
//     }
// }
//
// var me = new Person('Cyrus', 27);
// console.log(me.getUserDescription());
