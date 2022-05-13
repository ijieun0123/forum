let User = require('../models/user.model');

module.exports.postUser = (req, res) => {
    const body = req.body;
    const newUser = new User(body);

    newUser.save()
    .then(() => res.json(`Sign up success`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getUser = (req, res) => {
    const query = req.query;
    const body = Object.assign(query, {active: true})

    User.find(body)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    User.findByIdAndUpdate(id, body, {new: true})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndUpdate(id, {active: false})
    .then(() => res.json(`User deleted`))
    .catch(err => res.status(400).json('Error: ' + err));
}
