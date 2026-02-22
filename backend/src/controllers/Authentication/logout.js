
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", authCookieBaseOptions);
        
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};