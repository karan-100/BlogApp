const { verifyJWT } = require("../utils/generateToken");

async function verifyUser(req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Plese sign in"
            })
        }
        try {
            let user = await verifyJWT(token);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Plese sign in"
                })
            }

            req.user = user.payload.id;
            // console.log(req.user)
            next();
        } catch (err) {
            return res.status(500).json({
                message: error.message
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Token missing"
        })
    }
}

module.exports = verifyUser;