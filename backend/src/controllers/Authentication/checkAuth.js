
export const checkAuth = async (req, res) => {
    try {
        console.log("Cookies received:", req.cookies);
      

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
