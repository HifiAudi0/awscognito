const UserService = require(`./user.service.js`);

class UserController {

    async findByID(req, res) {
        const data = await UserService.findByID(req.params.UserID)

        res.json(data)
    }
}

module.exports = new UserController()