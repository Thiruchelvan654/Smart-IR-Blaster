const sql = require("../config/database");

exports.getAllButtons=async(req,res)=>{
    try {
        const result = await sql`
            SELECT * FROM "buttons"
        `;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching buttons:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllButtonByProjectorId=async(req,res)=>{
    const {id}=req.params;
    console.log(`Fetching buttons for projector_id: ${id}`);
    try {
        const result = await sql`
            SELECT * FROM "buttons"
            WHERE projector_id=${id}
        `;
        if(result.length===0){
            return res.status(404).json({message:"No buttons found for the given projector_id"});
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching buttons by projector_id:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getButtonById=async(req,res)=>{
    const {id}=req.params;
    try {
        const result = await sql`
            SELECT * FROM "buttons" WHERE id = ${id}
        `;
        if (!result || result.length === 0) return res.status(404).json({ message: "Button not found" });
        res.status(200).json(result[0]);
    }   catch (err) {
        console.error("Error fetching button by id:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createButton = async (req, res) => {
  const { name, hex_code, projector_id, row, column, column_span, colour } = req.body;

  if (!name || !hex_code || !projector_id) {
    return res.status(400).json({ message: "name, hex_code, and projector_id are required" });
  }

  try {
    const result = await sql`
      INSERT INTO "buttons" (
        "name",
        "hex_code",
        "projector_id",
        "row",
        "column",
        "column_span",
        "colour"
      )
      VALUES (
        ${name},
        ${hex_code},
        ${projector_id},
        ${row},
        ${column},
        ${column_span},
        ${colour}
      )
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating button:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.updateButton=async(req,res)=>{
    const {id}=req.params;
    const {name,hex_code,projector_id,row,column,column_span,colour}=req.body;
    if(!name||!hex_code||!projector_id){
        return res.status(400).json({message:"name, hex_code, and projector_id are required"});
    }

    try {
        const result = await sql`
            UPDATE "button"
            SET name=${name}, hex_code=${hex_code}, projector_id=${projector_id}, row=${row}, column=${column}, column_span=${column_span}, colour=${colour}
            WHERE id=${id}
            RETURNING *
        `;
        if (!result || result.length === 0) return res.status(404).json({ message: "Button not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error updating button:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteButton=async(req,res)=>{
    const {id}=req.params;
    try {
        const result = await sql`
            DELETE FROM "buttons" WHERE id=${id} RETURNING *
        `;
        if (!result || result.length === 0) return res.status(404).json({ message: "Button not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error deleting button:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};