const express = require("express");
const {
    createNote,
    listNotes,
    getNoteById,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");
const { isAuthenticatedStaker } = require("../middlewares/user_actions/auth");

const router = express.Router();

router.route("/")
    .get(isAuthenticatedStaker, listNotes)
    .post(isAuthenticatedStaker, createNote);

router.route("/:id")
    .get(isAuthenticatedStaker, getNoteById)
    .put(isAuthenticatedStaker, updateNote)
    .delete(isAuthenticatedStaker, deleteNote);

module.exports = router;