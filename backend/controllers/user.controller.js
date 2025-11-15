const sql = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

exports.changePassword = async (req, res) => {
    const {staff_id,oldpassword,newpassword}=req.body;
    if(!staff_id||!oldpassword||!newpassword){
        return res.status(400).json({message:"Staff ID, old password, and new password are required"});
    }
    console.log( `${staff_id}`, `${oldpassword}`, `${newpassword}`);
    try{
        const result=await sql`
        SELECT staff_id,password
        FROM "user"
        WHERE staff_id=${staff_id}
        `;
        const user=result[0];

        if(!user){
            return res.status(401).json({message:"Invalid staff ID or password"});
        }
        const isOldPasswordValid=await bcrypt.compare(oldpassword,user.password);
        if(!isOldPasswordValid){
            return res.status(401).json({message:"Invalid staff ID or password"});
        }
        const hashedNewPassword=await bcrypt.hash(newpassword,10);
        await sql`
        UPDATE "user"
        SET password=${hashedNewPassword}
        WHERE staff_id=${staff_id}
        `;
        res.status(200).json({message:"Password changed successfully"});
    }catch(err){
        console.error("Password change error:",err);
        res.status(500).json({message:"Internal server error"});
    }
};

// CRUD for users
exports.getAllUsers = async (req, res) => {
    try {
        const result = await sql`
            SELECT id, name, staff_id, role, designation, mail FROM "user" ORDER BY id
        `;
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`
            SELECT id, name, staff_id, role, designation, mail FROM "user" WHERE id = ${id}
        `;
        if (!result || result.length === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json(result[0]);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createUser = async (req, res) => {
    const { name, staff_id, role, designation, mail } = req.body;
    if (!name || !staff_id || !mail || !role) return res.status(400).json({ message: "name, staff_id, password and mail are required" });
    try {
        const hashed = await bcrypt.hash(staff_id, saltRounds);
        const inserted = await sql`
            INSERT INTO "user" (name, staff_id, password, role, designation, mail)
            VALUES (${name}, ${staff_id}, ${hashed}, ${role || 'user'}, ${designation || ''}, ${mail}) RETURNING id, name, staff_id, role, designation, mail
        `;
        res.status(201).json(inserted[0]);
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, staff_id, role, designation, mail } = req.body;
    try {
        const updated = await sql`
            UPDATE "user" SET name = ${name}, staff_id = ${staff_id}, role = ${role}, designation = ${designation}, mail = ${mail}
            WHERE id = ${id} RETURNING id, name, staff_id, role, designation, mail
        `;
        if (!updated || updated.length === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json(updated[0]);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await sql`
            DELETE FROM "user" WHERE id = ${id} RETURNING id
        `;
        if (!deleted || deleted.length === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


