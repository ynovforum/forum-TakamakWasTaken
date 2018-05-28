const Sequelize = require('sequelize');

function defineUser(database) {
    const User = database.define('user', {
        password: { type: Sequelize.STRING },
        name: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        bio: { type: Sequelize.TEXT },
        role: { type: Sequelize.ENUM('ADMIN', 'RANDOM') }
    });
    User.associate = ({ Question, Comment }) => {
        User.hasMany(Question);
        User.hasMany(Comment);
    };
    return User;
}

module.exports = defineUser;
