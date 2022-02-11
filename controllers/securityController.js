import express from "express";
import Player from "../models/playerModel.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import middleware from "../services/middleware.js";

const router = express.Router();
const saltRounds = 10;
const schemaPlayer = Joi.object({
    email: Joi.string().email().required().trim(true),
    password: Joi.string().min(8).required().trim(true),
    pseudo: Joi.string().required().trim(true),
    is_admin: Joi.boolean().default(false),
});

router
    .post("/register", async (req, res) => {
        const { email, password, pseudo } = req.body;
        try {
            const playerIsValid = schemaPlayer.validate({ email, password, pseudo });
            const playerExist = await Player.findByEmail(playerIsValid.value.email);
            if (playerIsValid.error) return res.json({ error: playerIsValid.error.details[0].message }).status(422);
            if (playerExist) return res.json({ error: "L'email existe déjà" }).status(409);
            try {
                const hash = bcrypt.hashSync(playerIsValid.value.password, saltRounds);
                playerIsValid.value.password = hash;
                const playerId = await Player.createNew(playerIsValid.value);
                const player = await Player.findById(playerId);
                res.json(player).status(201);
            } catch (error) {
                res.json({ error: error.message }).status(500);
            }
        } catch (error) {
            res.json({ message: error.message }).status(500);
        }
    })
    .post("/login", async (req, res) => {
        const { email, password } = req.body;
        try {
            const playerIsValid = schemaPlayer.validate({ email, password });
            const playerExist = await Player.findByEmail(playerIsValid.value.email);
            if (playerExist) {
                const passwordIsValid = bcrypt.compareSync(playerIsValid.value.password, playerExist.password);
                if (passwordIsValid) {
                    const token = jwt.sign({ id: playerExist.id, role: playerExist.is_admin }, process.env.SERVER_SECRET, {
                        expiresIn: 360000 * 4,
                    });
                    res.send({
                        token: token,
                        player: {
                            id: playerExist.id,
                            email: playerExist.email,
                            pseudo: playerExist.pseudo,
                            role: playerExist.is_admin,
                        },
                    }).status(200);
                } else res.json({ error: "Mot de Passe Invalide" }).status(401);
            } else res.json({ error: "Joueur non trouvé" }).status(404);
        } catch (error) {
            res.json({ message: error.message }).status(500);
        }
    })

    .get("/player-is-auth", middleware.verifyJWT, (req, res) => {
        res.json({ auth: true, message: "Joueur authentifié" }).status(200);
    });

export default router;
