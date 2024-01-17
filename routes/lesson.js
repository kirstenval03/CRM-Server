const express = require('express');
const router = express.Router();
const Module = require('../models/Academy'); // Assuming you've named your model 'Modules'


// Get all lessons within a module
router.get('/modules/:moduleId/lessons', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module.lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Create a new lesson within a module
router.post('/modules/:moduleId/new-lesson', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    module.lessons.push(req.body); // Add the new lesson to the module's lessons array
    await module.save();

    res.status(201).json(module.lessons[module.lessons.length - 1]); // Return the newly added lesson
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Get a specific lesson within a module by ID
router.get('/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific lesson within a module by ID
router.put('/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    lesson.set(req.body);
    await module.save();

    res.json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific lesson within a module by ID
router.delete('/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    lesson.remove();
    await module.save();

    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
