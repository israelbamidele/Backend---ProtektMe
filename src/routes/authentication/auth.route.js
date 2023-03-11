const { Router } = require("express");
const Auth = require("../../controller/Authentication/auth");
const { body } = require("express-validator");
const router = Router();

router.post("/sign-up", Auth.signup);
router.post("/login", Auth.login);
router.patch("/update-password", Auth.protected, Auth.updatePassword);

module.exports = router;
