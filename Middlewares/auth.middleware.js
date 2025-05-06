const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'medpro_secret';

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};



// exports.generateToken = (user) => {

// }
