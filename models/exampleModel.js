import dbConnect from "../config/db-config.js";

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbConnect.query("SELECT * FROM example", (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

// READ ONE
const getOneById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query("SELECT * FROM example WHERE id = ?", id, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
};

// DELETE
const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query("DELETE FROM example WHERE id = ?", id, (err, result) => {
            if (err) reject(err);
            else resolve(result.affectedRows);
        });
    });
};

// CREATE
const createNew = (example) => {
    const { title } = example;
    return new Promise((resolve, reject) => {
        dbConnect.query("INSERT INTO example (title) VALUES (?)", title, (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        });
    });
};

// UPDATE
const updateExample = (example) => {
    const { title, id } = example;
    return new Promise((resolve, reject) => {
        dbConnect.query("UPDATE example SET title = ? WHERE id = ?", [title, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

export default { getAll, getOneById, deleteById, createNew, updateExample };
