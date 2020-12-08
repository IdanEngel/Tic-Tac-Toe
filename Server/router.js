/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send('server is runnimg')
})

module.exports = router;