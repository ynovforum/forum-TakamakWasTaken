const Sequelize = require('sequelize');

function defineQuestion(database) {
    const Question = database.define('question', {
        title: { type: Sequelize.STRING },
        description: { type: Sequelize.TEXT },
        resolved_at: { type: Sequelize.DATE },
        resolving_question: { type: Sequelize.INTEGER}
    });
    Question.associate = ({ User, Comment }) => {
        Question.belongsTo(User);
        Question.hasMany(Comment);
    };
    return Question;
}

module.exports = defineQuestion;

