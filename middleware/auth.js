// Importation du module 'jsonwebtoken'
const jwt = require('jsonwebtoken');
 
const dotenv = require("dotenv").config();
const tokenKey = process.env.tokenKey;

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, tokenKey);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};