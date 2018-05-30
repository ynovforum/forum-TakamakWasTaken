const Sequelize = require('sequelize');

function defineQuestion(database) {
    const Question = database.define('question', {
        title: { type: Sequelize.STRING },
        description: { type: Sequelize.TEXT },
        resolvedAt: { type: Sequelize.DATE }
    });
    Question.associate = ({ User, Comment }) => {
        Question.belongsTo(User);
        Question.hasMany(Comment);
    };
    return Question;
}

module.exports = defineQuestion;

