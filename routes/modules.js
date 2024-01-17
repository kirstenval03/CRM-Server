const express = require('express');
const router = express.Router();
const Module = require('../models/Academy');

// Get all modules
router.get('/', async (req, res) => {
    try {
      const modules = await Module.find();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Create a new module
router.post('/new-module', async (req, res) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Get a specific module by ID
router.get('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific module by ID
router.put('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific module by ID
router.delete('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json({ message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific lesson within a module by ID
router.get('/:moduleId/lessons/:lessonId', async (req, res) => {
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

module.exports = router;
