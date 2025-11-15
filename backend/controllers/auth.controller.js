const sql = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { staff_id, password } = req.body;
    if (!staff_id || !password) {
      console.log("Missing staff_id or password in request body"); 
      return res.status(400).json({ message: "Staff ID and password are required" });
    }
  try {
    const result = await sql`
      SELECT id,name, staff_id, password
      FROM "user"
      WHERE staff_id = ${staff_id}
    `;
    const user = result[0];
    if (!user) {
      console.log("Invalid login attempt for staff_id:", staff_id);
      return res.status(401).json({ message: "Invalid staff ID or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password attempt for staff_id:", staff_id);
      return res.status(401).json({ message: "Invalid staff ID or password" });
    }
    
    // Check if user is using their staff_id as password (default password)
    const isUsingDefaultPassword = password === staff_id;
    const token = jwt.sign({ id: user.id, staff_id: user.staff_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    if (isUsingDefaultPassword) {
      console.log("Default password (staff_id) used for staff_id:", staff_id);
      return res.status(200).json({ 
        token, 
        forceChange: true, 
        message: "Default password used, please change your password",
        name: user.name 
      });
    }
   
    console.log("Login successful for staff_id:", staff_id);
    res.status(200).json({ 
      token, 
      forceChange: false,
      message: "Login successful", 
      name: user.name 
    });
  } catch (err) {
    console.error("Login error:", err);
    console.log("Login error for staff_id:", staff_id);
    res.status(500).json({ message: "Internal server error" });
  }
};