import User from "../../../models/User.js";
import cloudinary from "../../lib/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    // console.log("userId:", userId);
    
    if (!profilePic) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(profilePic, {
      resource_type: "auto"
    });


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic
      }
    });

  } catch (error) {
    console.error("ERROR in updateProfile:", error);
    res.status(500).json({ message: "Upload failed"});
  }
};