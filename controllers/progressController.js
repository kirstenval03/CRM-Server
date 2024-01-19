const Progress = require('../models/Progress');

exports.completeLesson = async (req, res) => {
    const { userId, lessonId } = req.body;

    try {
        const progress = await Progress.findOneAndUpdate(
            { userId },
            { $addToSet: { completedLessons: lessonId } },
            { new: true }
        );

        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete lesson' });
    }
};

exports.getUserProgress = async (req, res) => {
    const { userId } = req.params;

    try {
        const progress = await Progress.findOne({ userId });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user progress' });
    }
};
