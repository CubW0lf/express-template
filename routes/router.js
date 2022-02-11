import securityController from "../controllers/securityController.js";
import exampleController from "../controllers/exampleController.js";

export const setupRoutes = (app) => {
    app.use("/security", securityController);
    app.use("/example", exampleController);
};
