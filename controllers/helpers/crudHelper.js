const express = require('express');

const generateCRUDRoutes = (MODEL_NAME, middleware=(_req, _res, next)=>{next()}) => {
    const model = require(`../../models/${MODEL_NAME}.js`);
    const router = express.Router();

    // Helper to remove user_id from response
    const stripUserId = (item) => {
        if (!item) return item;
        const { user_id, ...rest } = item;
        return rest;
    };

    const stripUserIdFromArray = (items) => {
        if (!Array.isArray(items)) return items;
        return items.map(stripUserId);
    };

    // Create
    router.post('/', middleware, async (req, res) => {
        try {
            const body = { ...req.body, user_id: req.user.id };
            const item = await model.create(body);
            res.status(201).json(stripUserId(item));
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Read All
    router.get('/', middleware, async (req, res) => {
        try {
            const { index, limit } = req.query;
            if (index !== undefined && limit !== undefined) {
                const paginatedItems = await model.findBy({ user_id: req.user.id }, { index: parseInt(index), limit: parseInt(limit)});
                return res.status(200).json(stripUserIdFromArray(paginatedItems));
            }
            const items = await model.findBy({ user_id: req.user.id }, { index: 0, limit: 100 });
            res.status(200).json(stripUserIdFromArray(items));
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
            res.status(200).json(stripUserId(item));
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
            res.status(200).json(stripUserId(updatedItem));
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Delete
    router.delete('/:id', middleware, async (req, res) => {
        try {
            const deleted = await model.deleteById(req.params.id);
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