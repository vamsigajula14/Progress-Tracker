const jwt = require('jsonwebtoken');
const secretekey = process.env.JWT_SECRET;

function middleware(req,res,next){
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        const token = req.headers.authorization.split(" ")[1];
        try{
            const decode = jwt.verify(token,secretekey);
            if (decode){
                req.user = {
                    id : decode.id,
                    name : decode.name,
                    email : decode.email
                }
               return  next();
            }

        }
        catch(err){
            res.status(403).json({
                error : err.message || "Token expire or invalid"
            })
        }
    }
    else{
        res.status(401).json({
            message : "Unauthorized"
        })
    }
}

module.exports = middleware;
