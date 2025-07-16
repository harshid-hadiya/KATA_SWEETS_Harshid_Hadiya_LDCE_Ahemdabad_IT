const jwt = require("jsonwebtoken");

const OWNER_USERNAME = "shopowner";
const OWNER_PASSWORD = "ownerpass"; 
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.loginOwner = (req, res) => {
  const { username, password } = req.body;
  if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
    const token = jwt.sign({ role: "owner", username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
  }
  res.status(401).json({ error: "Invalid owner credentials" });
};
