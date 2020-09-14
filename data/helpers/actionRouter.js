const express = require("express");

const router = express.Router();

const Actions = require("./actionModel.js");

router.post("/", validateAction, (req, res) => {
  Actions.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving action to the database.",
      });
    });
});

router.get("/:id", validateActionId, (req, res) => {
  Actions.get(req.action)
    .then(() => res.status(200).json(req.action))
    .catch((error) => {
      res.status(500).json({
        error: "The action information could not be retrieved.",
      });
    });
});

router.put("/:id", validateActionId, (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(() => {
      Actions.get(req.params.id).then((action) => {
        res.status(200).json(action);
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "The action could not be modified",
      });
    });
});

router.delete("/:id", validateActionId, (req, res) => {
  Actions.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({message: "The action has been nuked"});
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: "The action could not be removed",
      });
    });
});

//Custom middleware

function validateAction(req, res, next) {
  if (!req.body) {
    res.status(400).json({message: "missing user data"});
  } else if (!req.body.project_id) {
    res.status(400).json({message: "missing required project id"});
  } else if (!req.body.description) {
    res.status(400).json({message: "missing required description field"});
  } else if (req.body.description.length > 128) {
    res.status(400).json({message: "limit description to 128 characters"});
  } else if (!req.body.notes) {
    res.status(400).json({message: "missing required notes field"});
  } else {
    next();
  }
}

function validateActionId(req, res, next) {
  Actions.get(req.params.id).then((action) => {
    if (!action) {
      res.status(400).json({
        message: "invalid action id",
      });
    } else {
      req.action = action;
      next();
    }
  });
}

module.exports = router;
