import express from "express"
import {  getallContact, getChatPartners, getsingleChat, sendMessage } from "../controllers/MessagesController/getallcontacts.js";
import { bruteforceLimitor, IPrateLimitor } from "../middleware/ratelimitmiddleWare.js";
import securityRoute from "../middleware/auth.middleware.js";
import {upload} from "../controllers/MessagesController/getallcontacts.js"
const router = express.Router();

// router.use(IPrateLimitor,bruteforceLimitor)

router.get("/contacts",securityRoute,getallContact);

router.get("/chats",securityRoute, getChatPartners)

router.get("/chat/:id",securityRoute,getsingleChat);

router.post("/send/:id",securityRoute,upload.single('file'),sendMessage);


export default router;