import express from "express";
import Example from "../models/exampleModel.js";
import Joi from "joi";
const router = express.Router();

const schemaExample = Joi.object({
    id: Joi.number().integer(),
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).required(),
    image: Joi.string().min(3),
    date: Joi.date().required(),
    id_category: Joi.number().integer().required(),
});

router
    .get("/:id", async (req, res) => {
        const id = req.params.id;
        try {
            const example = await Example.getOneById(id);

            res.json(example).status(200);
        } catch (error) {
            res.json({ message: error.message }).status(500);
        }
    })

    .get("/", async (req, res) => {
        try {
            const example = await Example.getAll();

            res.json(example);
        } catch (error) {
            res.json({ message: error.message }).status(500);
        }
    })

    .put("/:id", async (req, res) => {
        const example = {
            id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            date: req.body.date,
            id_category: req.body.id_category,
        };

        try {
            const { error, value } = await schemaExample.validate(example);
            const exampleUpdate = await Example.updateExample(value);
            if (exampleUpdate) res.json(example);
            else res.json({ message: error.message }).status(422);
        } catch (err) {
            res.json({ message: err.message }).status(500);
        }
    })

    .post("/", async (req, res) => {
        const example = {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            date: req.body.date,
            id_category: req.body.id_category,
        };

        try {
            const { error, value } = await schemaExample.validate(example);
            const exampleCreate = await Example.createNew(value);
            if (exampleCreate) {
                const newExample = await Example.getOneById(exampleCreate);
                res.json(newExample);
            } else res.json({ message: error.message }).status(422);
        } catch (err) {
            res.json({ message: err.message }).status(500);
        }
    })

    .delete("/:id", async (req, res) => {
        const id = req.params.id;
        try {
            const exampleDelete = await Example.deleteById(id);
            if (exampleDelete) {
                res.json(`L'example ${id} a bien été effacée`);
            } else {
                res.json(`Une erreur est survenue lors de la suppression`).status(422);
            }
        } catch (error) {
            res.json(`Erreur serveur`).status(500);
        }
        return res.status(201).end();
    });

export default router;
