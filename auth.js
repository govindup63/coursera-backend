const jwt = require('jsonwebtoken')
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET
const JWT_USER_SECRET = process.env.JWT_USER_SECRET

function userAuth(req, res, next) {
  const token = req.headers.token;
  const response = jwt.verify(token, JWT_USER_SECRET)
  if (response) {
    req.userId = response.id;
    next()
  } else {
    res.status(403).json({
      message: "auth error"
    })
  }

}

function adminAuth(req, res, next) {
  const token = req.headers.token;
  const response = jwt.verify(token, JWT_ADMIN_SECRET)
  if (response) {
    req.userId = response.id;
    next()
  } else {
    res.status(403).json({
      message: "auth error"
    })
  }

}


module.exports = {
  userAuth,
  adminAuth,
  JWT_ADMIN_SECRET,
  JWT_USER_SECRET,
  jwt
}
