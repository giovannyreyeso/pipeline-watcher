const express = require('express');
const routes = express.Router();
const controller = require('../controller');
routes.post('/register', async (req, res) => {
    if (!Array.isArray(req.body.hooks)) {
        return res.status(400).json({
            message: "hooks field is not an array"
        });
    }
    controller.checkPipeline(req.body)
    return res.status(200).send("OK")
})

module.exports = routes