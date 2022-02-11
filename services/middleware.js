import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
 const token = req.headers["x-access-token"];
 if(!token) return res.json({error: "pas de jeton fourni"}).status(401);
 jwt.verify(token, process.env.SERVER_SECRET, (err) => {
   if(err) return res.json({error: "jeton non valide"}).status(401);
   next();
 })
}

const verifyAdmin= (req, res, next) => {
  const token = req.headers["x-access-token"];
  if(!token) return res.json({error: "pas de jeton fourni"}).status(401);
  jwt.verify(token, process.env.SERVER_SECRET, (err, decoded) => {
    if(err) return res.json({error: "jeton non valide"}).status(401);
    if(decoded.role !== 1) return res.json({error: "you are not admin"}).status(401);
    next();
  })
 }

export default { verifyJWT, verifyAdmin };