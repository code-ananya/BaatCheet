import { User } from "../models/user.models.js";
import { FriendRequest } from "../models/friendRequest.model.js";

export async function getReccomendedUsers(req,res){
    try {
        const currentUserId=req.user._id;
        const currentUser=req.user

        const reccomendedUsers=await User.find({
            $and:[
                {_id:{$ne:currentUserId}},//exclude current user
                {_id:{$nin:currentUser.friends}},//exclude current user friends
                {isOnboarded:true}

            ]
        })
        res.status(200).json(reccomendedUsers)
    } catch (error) {
        console.error("Error in getReccomendedUsers controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}
export async function getMyFriends(req,res) {
    try {
        const user=await User.findById(req.user._id)
        .select("friends")
        .populate("friends","fullName,profilePic,nativeLanguage,learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller",error.message);
         res.status(500).json({message:"Internal Server Error"});

        
    }
}
export async function sendFriendRequest(req,res){
    try {
        const myId=req.user._id;
        const { id: recipientId}=req.params
        if(myId===recipientId){
            return res.status(400).json({message:"You can't send friend request to yourself"});
        }
        const recipient=await User.findById(recipientId)
        if(!recipient){
            return res.status(404).json({message:"Recipient not found"});
        }
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"});
        }

        const existingFriendRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId },
                {sender:recipientId,recipient:myId},
            ],
        })
        if(existingFriendRequest){
            return res
            .status(400)
            .json({message:"A friend request already exist between you and the user"});
        }
        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        });
        res.status(201).json(friendRequest)
    } catch (error) {
         console.error("Error in  sendFriendRequest controller",error.message);
         res.status(500).json({message:"Internal Server Error"});
        
    }

}

export async function acceptFriendRequest(req,res) {
    try {
        const {id:requestId}=req.params;
        const friendRequest=await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }

        if(friendRequest.recipient.toString()!=req.user._id){
            return res.status(403).json({message:"You are not authorized to accept this request"});
        }
        friendRequest.status="accepted"
        await friendRequest.save()

        // add each user's to others friends array
       await User.findByIdAndUpdate(friendRequest.sender,{
        $addToSet:{friends:friendRequest.recipient}
       });
        await User.findByIdAndUpdate(friendRequest.recipient,{
        $addToSet:{friends:friendRequest.sender}
       });
       res.status(200).json({message:"Friend request accepted"});

    } catch (error) {
        console.error("Error in  acceptFriendRequest controller",error.message);
         res.status(500).json({message:"Internal Server Error"});
        
    }
    
}

// Get friend requests for the current user
export async function getFriendRequests(req,res){
    try {
        // One-time migration: Update all friend requests with undefined status to "pending"
        await FriendRequest.updateMany(
            { status: { $exists: false } },
            { $set: { status: "pending" } }
        );
        await FriendRequest.updateMany(
            { status: null },
            { $set: { status: "pending" } }
        );
        await FriendRequest.updateMany(
            { status: undefined },
            { $set: { status: "pending" } }
        );

        const incomingRqs=await FriendRequest.find({
            recipient:req.user._id,
            status:"pending",

        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedRqs=await FriendRequest.find({
            recipient:req.user._id,
            status:"accepted",

        }).populate("sender","fullName profilePic");

        res.status(200).json({incomingRqs,acceptedRqs});
    } catch (error) {
        console.error("Error in  getFriendRequests controller",error.message);
         res.status(500).json({message:"Internal Server Error"});

    }
}
export async function getOutgoingFriendRequests(req,res) {
    try {
        const outgoingRequests=await FriendRequest.find({
            sender:req.user._id,
            status:"pending",

        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
        
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller",error.message);
         res.status(500).json({message:"Internal Server Error"});
        
    }
    
}
export async function rejectFriendRequests(req,res) {
    try {
        const {id:requestId}=req.params
        const friendRequest=await FriendRequest.findById(requestId)
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }
        // Allow both recipient (reject) and sender (cancel) to delete the request
        if(friendRequest.recipient.toString()!=req.user._id && friendRequest.sender.toString()!=req.user._id){
             return res.status(403).json({message:"You are not authorized to delete this request"});
        }
        await FriendRequest.findByIdAndDelete(requestId)
         res.status(200).json({message:"Friend request deleted"});

    } catch (error) {
        console.error("Error in rejectFriendRequest controller",error.message);
         res.status(500).json({message:"Internal Server Error"});
    }

} 