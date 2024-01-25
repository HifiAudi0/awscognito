const UserRepository = require(`./user.repo.js`);

class UserService {

    async findByID(UserID) {
        const data = await UserRepository.findByID(UserID);

        if (data) {
            return data.Item;
        }

        return data;
    }
}

module.exports = new UserService()