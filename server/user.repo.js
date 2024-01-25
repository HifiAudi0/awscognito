const db = require(`./database`);
const { v4: uuidv4 } = require('uuid');

class UserRepository {
    constructor() {
        this.tableName = 'PointsUsers';
    }

    async findByID(UserID) {
        const params = {
            TableName: this.tableName,
            Key: {
                UserID,
            },
        };

        return await db.get(params).promise();
    }
}

module.exports = new UserRepository();