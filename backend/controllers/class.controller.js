const sql = require("../config/database");

exports.getAllClasses=async(req,res)=>{
    console.log("Fetching all classrooms with projector IDs");
    try {
        const result = await sql`
            SELECT * FROM "classroom"
        `;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`
            SELECT * FROM "classroom" WHERE id = ${id}
        `;
        if (!result || result.length === 0) return res.status(404).json({ message: "Class not found" });
        res.status(200).json(result[0]);
    } catch (err) {
        console.error("Error fetching class by id:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createClass = async (req, res) => {
    const { name, projector_id } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });
    try {
        const inserted = await sql`
            INSERT INTO "classroom" (name, projector_id) VALUES (${name}, ${projector_id || null}) RETURNING *
        `;
        res.status(201).json(inserted[0]);
    } catch (err) {
        console.error("Error creating class:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, projector_id } = req.body;
    try {
        const updated = await sql`
            UPDATE "classroom" SET name = ${name}, projector_id = ${projector_id} WHERE id = ${id} RETURNING *
        `;
        if (!updated || updated.length === 0) return res.status(404).json({ message: "Class not found" });
        res.status(200).json(updated[0]);
    } catch (err) {
        console.error("Error updating class:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await sql`
            DELETE FROM "classroom" WHERE id = ${id} RETURNING *
        `;
        if (!deleted || deleted.length === 0) return res.status(404).json({ message: "Class not found" });
        res.status(200).json({ message: "Class deleted" });
    } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

