import express from "express"
import { checkme, getallContact, getChatPartners, getsingleChat, sendMessage } from "../controllers/MessagesController/getallcontacts.js";
import { bruteforceLimitor, IPrateLimitor } from "../middleware/ratelimitmiddleWare.js";
import securityRoute from "../middleware/auth.middleware.js";
const router = express.Router();

// router.use(IPrateLimitor,bruteforceLimitor)

router.get("/contacts",securityRoute,getallContact);

router.get("/chats",securityRoute, getChatPartners)

router.get("/chat/:id",securityRoute,getsingleChat);

router.post("/send/:id",securityRoute,sendMessage);


export default router;