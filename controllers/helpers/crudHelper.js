const express = require('express');

const generateCRUDRoutes = (MODEL_NAME, middleware=(_req, _res, next)=>{next()}) => {
    const model = require(`../../models/${MODEL_NAME}.js`);
    const router = express.Router();

    // Create
    router.post('/', middleware, async (req, res) => {
        try {
            const item = await model.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Read All
    router.get('/', middleware, async (req, res) => {
        try {
            const { index, limit } = req.query;
            if (index !== undefined && limit !== undefined) {
                const paginatedItems = await model.findAll({ index: parseInt(index), limit: parseInt(limit)});
                return res.status(200).json(paginatedItems);
            }
            const items = await model.findAll({ index: 0, limit: 100 });
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Read One
    router.get('/:id', middleware, async (req, res) => {
        try {
            const item = await model.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Update
    router.put('/:id', middleware, async (req, res) => {
        try {
            const updatedItem = await model.update(req.params.id, req.body);
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(updatedItem);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Delete
    router.delete('/:id', middleware, async (req, res) => {
        try {
            const deleted = await model.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};

module.exports = generateCRUDRoutes;