const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const notesMap = new Map();
let nextId = 1;

const getUserNotes = (userId) => {
    if (!notesMap.has(userId)) {
        notesMap.set(userId, new Map());
    }
    return notesMap.get(userId);
};

exports.createNote = asyncErrorHandler(async (req, res, next) => {
    const { comment } = req.body;

    if (!comment) {
        return next(new ErrorHandler("Comment is required", 400));
    }

    const userId = String(req.staker._id || req.staker.id);
    const userNotes = getUserNotes(userId);
    const noteId = String(nextId++);

    const newNote = {
        id: noteId,
        stakerId: userId,
        comment,
        isDeleted: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    userNotes.set(noteId, newNote);

    res.status(201).json({
        success: true,
        data: newNote
    });
});

exports.listNotes = asyncErrorHandler(async (req, res, next) => {
    const userId = String(req.staker._id || req.staker.id);
    const userNotes = getUserNotes(userId);
    const activeNotes = Array.from(userNotes.values()).filter(note => note.isDeleted === null);

    res.status(200).json({
        success: true,
        count: activeNotes.length,
        data: activeNotes
    });
});

exports.getNoteById = asyncErrorHandler(async (req, res, next) => {
    const userId = String(req.staker._id || req.staker.id);
    const userNotes = getUserNotes(userId);
    const note = userNotes.get(req.params.id);

    if (!note || note.isDeleted !== null) {
        return next(new ErrorHandler("Note not found", 404));
    }

    res.status(200).json({
        success: true,
        data: note
    });
});

exports.updateNote = asyncErrorHandler(async (req, res, next) => {
    const userId = String(req.staker._id || req.staker.id);
    const userNotes = getUserNotes(userId);
    const note = userNotes.get(req.params.id);

    if (!note || note.isDeleted !== null) {
        return next(new ErrorHandler("Note not found", 404));
    }

    const { comment } = req.body;
    if (comment !== undefined) {
        note.comment = comment;
    }
    note.updatedAt = new Date();

    res.status(200).json({
        success: true,
        data: note
    });
});

exports.deleteNote = asyncErrorHandler(async (req, res, next) => {
    const userId = String(req.staker._id || req.staker.id);
    const userNotes = getUserNotes(userId);
    const note = userNotes.get(req.params.id);

    if (!note || note.isDeleted !== null) {
        return next(new ErrorHandler("Note not found or already deleted", 404));
    }

    note.isDeleted = new Date();

    res.status(200).json({
        success: true,
        message: "Note deleted successfully",
        data: note
    });
});