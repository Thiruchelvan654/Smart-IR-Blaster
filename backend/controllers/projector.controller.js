const sql = require("../config/database");

exports.getAllProjectors = async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM "projector" ORDER BY id
    `;
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching projectors:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProjectorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      SELECT * FROM "projector" WHERE id = ${id}
    `;
    if (!result || result.length === 0) return res.status(404).json({ message: "Projector not found" });
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error fetching projector:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProjector = async (req, res) => {
  const { name, protocol, bits, frequency } = req.body;
  if (!name || !protocol) return res.status(400).json({ message: "name and model are required" });
  try {
    const inserted = await sql`
      INSERT INTO "projector" (name, protocol, bits, frequency)
      VALUES (${name}, ${protocol}, ${bits}, ${frequency})
      RETURNING *
    `;
    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error("Error creating projector:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProjector = async (req, res) => {
  const { id } = req.params;
  const { name, protocol, bits, frequency } = req.body;
  try {
    const updated = await sql`
      UPDATE "projectors" SET name = ${name}, protocol = ${protocol}, bits = ${bits}, frequency = ${frequency}
      WHERE id = ${id} RETURNING *
    `;
    if (!updated || updated.length === 0) return res.status(404).json({ message: "Projector not found" });
    res.status(200).json(updated[0]);
  } catch (err) {
    console.error("Error updating projector:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProjector = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await sql`
      DELETE FROM "projector" WHERE id = ${id} RETURNING *
    `;
    if (!deleted || deleted.length === 0) return res.status(404).json({ message: "Projector not found" });
    res.status(200).json({ message: "Projector deleted" });
  } catch (err) {
    console.error("Error deleting projector:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
