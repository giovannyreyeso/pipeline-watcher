const express = require('express');
const routes = express.Router();
const controller = require('../controller');
routes.post('/register', async (req, res) => {
    controller.checkPipeline(req.body)
    return res.status(200).send("OK")
})

module.exports = routes