const { Router } = require("express");
const UserController = require("../../controller/User/user");
const { protected } = require("../../controller/Authentication/auth");

const router = Router();
router.use(protected);
router.get("/me", UserController.getCurrentUser);
router.get("/:user_id", UserController.getAUser);

module.exports = router;
