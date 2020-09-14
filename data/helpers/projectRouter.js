const express = require("express");

const router = express.Router();

const Projects = require("./projectModel.js");
const Actions = require("./actionModel.js");

router.post("/", validateProject, (req, res) => {
  Projects.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving project to the database.",
      });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  Projects.get(req.project)
    .then(() => res.status(200).json(req.project))
    .catch((error) => {
      res.status(500).json({
        error: "The project information could not be retrieved.",
      });
    });
});

router.get("/:id/actions", validateProjectId, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then((project) => res.status(200).json(project))
    .catch((error) => {
      res.status(500).json({
        error: "The project information could not be retrieved.",
      });
    });
});

router.put("/:id", validateProjectId, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(() => {
      Projects.get(req.params.id).then((project) => {
        res.status(200).json(project);
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "The project could not be modified",
      });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  Projects.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({message: "The project has been nuked"});
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: "The project could not be removed",
      });
    });
});

//Custom middleware
function validateProject(req, res, next) {
  if (!req.body) {
    res.status(400).json({message: "missing user data"});
  } else if (!req.body.name) {
    res.status(400).json({message: "missing required name field"});
  } else if (!req.body.description) {
    res.status(400).json({message: "missing required description field"});
  } else {
    next();
  }
}

function validateProjectId(req, res, next) {
  Projects.get(req.params.id).then((project) => {
    if (!project) {
      res.status(400).json({
        message: "invalid project id",
      });
    } else {
      req.project = project;
      next();
    }
  });
}

module.exports = router;
