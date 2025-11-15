const sql = require("../config/database");

exports.getAllLogs = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM "log_disp" ORDER BY start_time ASC
        `;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLogsByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const result = await sql`
            SELECT * FROM "log_disp" WHERE DATE(timestamp) = ${date} ORDER BY timestamp DESC
        `;
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching logs by date:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLogsByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`
            SELECT * FROM "log_disp" WHERE user_id = ${id} ORDER BY timestamp DESC
        `;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching logs by user ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createLog = async (req, res) => {
  const { staff_id, classroom_name, start_time, end_time, duration } = req.body;

  console.log("\n=== [CREATE LOG ATTEMPT] ===");
  console.log("Incoming request body:", req.body);

  // 🧩 Validate required inputs
  if (!staff_id || !classroom_name || !start_time || !end_time || !duration) {
    console.warn("[VALIDATION FAILED] Missing required fields.");
    return res.status(400).json({
      message:
        "staff_id, classroom_name, start_time, end_time, and duration are required.",
    });
  }

  try {
    // 🟢 STEP 1: Get user.id from staff_id
    console.log(`[STEP 1] Looking up user.id for staff_id=${staff_id}...`);
    const userResult = await sql`
      SELECT id FROM "user" WHERE staff_id = ${staff_id};
    `;
    if (userResult.length === 0) {
      console.warn(`[USER NOT FOUND] staff_id=${staff_id}`);
      return res.status(400).json({ message: `Staff ID ${staff_id} not found in user table.` });
    }
    const userId = userResult[0].id;
    console.log(`[OK] Found user.id=${userId}`);

    // 🟢 STEP 2: Get classroom.id from classroom_name
    console.log(`[STEP 2] Looking up classroom.id for name='${classroom_name}'...`);
    const classResult = await sql`
      SELECT id FROM "classroom" WHERE name = ${classroom_name};
    `;
    if (classResult.length === 0) {
      console.warn(`[CLASSROOM NOT FOUND] name='${classroom_name}'`);
      return res.status(400).json({ message: `Classroom '${classroom_name}' not found in classroom table.` });
    }
    const classroomId = classResult[0].id;
    console.log(`[OK] Found classroom.id=${classroomId}`);

    // 🟢 STEP 3: Insert into log table using internal IDs
    console.log("[STEP 3] Inserting new log record...");
    const result = await sql`
      INSERT INTO "log" (staff_id, classroom_id, start_time, end_time, duration)
      VALUES (${userId}, ${classroomId}, ${start_time}, ${end_time}, ${duration})
      RETURNING *;
    `;

    console.log("[SUCCESS] Log created:", result[0]);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("\n[ERROR CREATING LOG]");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: "Internal server error" });
  }

  console.log("=== [END OF LOG CREATION] ===\n");
};




exports.deleteLog = async (req, res) => {
    const { session_id } = req.params;
    try {
        const result = await sql`
            DELETE FROM "log" WHERE id = ${session_id} RETURNING *
        `;
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error deleting log:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};