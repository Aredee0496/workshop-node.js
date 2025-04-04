const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        let token = req.headers.authorization
        if(!token) return res.status(401).send("Unauthorized")
        req.auth = token
        next()
    }catch(err){
        res.status(401).send(error)
    }
}
