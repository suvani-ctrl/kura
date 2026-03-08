import express from "express"
import { bruteforceLimitor, IPrateLimitor } from "../middleware/ratelimitmiddleWare.js";
import securityRoute from "../middleware/auth.middleware.js";
import {upload} from "../controllers/MessagesController/getallcontacts.js"
import { getAllContactsController } from "../controllers/MessagesController/getAllContact.js";
import { getChatPartners } from "../controllers/MessagesController/getChatPartners.js";
import {getsingleChat} from "../controllers/MessagesController/getsingleChat.js"
const router = express.Router();

// router.use(IPrateLimitor,bruteforceLimitor)

router.get("/contacts",securityRoute,getAllContactsController);

router.get("/chats",securityRoute, getChatPartners)

router.get("/chat/:id",securityRoute,getsingleChat);

// router.post("/send/:id",securityRoute,upload.single('file'),sendMessage);


export default router;