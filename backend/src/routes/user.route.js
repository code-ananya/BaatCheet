import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getReccomendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendRequests,rejectFriendRequests} from "../controllers/user.controller.js";

const router=Router();
router.use(protectRoute);

router.get("/",getReccomendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)
router.delete("/friend-request/:id",rejectFriendRequests)

router.get("/friend-request",getFriendRequests)
router.get("/outgoing-friend-request",getOutgoingFriendRequests)
router.put("/friend-request/:id/reject",rejectFriendRequests)  




export default router
