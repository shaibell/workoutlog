const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validate-jwt.js');
const { logModel } = require('../models');

router.post('/create', validateJWT, async (req, res) => {
    const { title, date, description, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        title,
        date,
        description,
        result,
        owner_id: id
    }
    try {
        const newLog = await logModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
get all logs
*/
router.get("/", async (req, res) => {
    try {
        const description = await logModel.findAll();
        res.status(200).json(description);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/*
Get logs by user
*/
router.get("/mine", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await logModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
Get logs by title
*/
router.get("/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const results = await logModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
update a log
*/
router.put("/updte/:entryId", validateJWT, async (req, res) => {
    const { title, date, description, result } = req.body.log;
    const loglId = req.params.descriptionId;
    const userId = req.user.id;

const query = {
    where: {
        id: logId,
        owner: userId
    }
};

const updatedLog = {
    title: title,
    date: date,
    description: description,
    result: result
};

try {
    const update = await logModel.update(updatedLog, query);
    res.status(200).json(update);
} catch (err) {
    res.status(500).json({ error: err });
}
});

/*
delete log
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner:ownerId
            }
        };

    await logModel.destroy(query);
    res.status(200).json({ message: "log entry removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})
module.exports = router;