import pool from "@/lib/db"; // MySQL Connection Pool

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // ✅ Fetch specific schema
      const [rows] = await pool.query("SELECT * FROM `api_schemas` WHERE id = ?", [id]);

      if (rows.length === 0) {
        return new Response(JSON.stringify({ message: "Schema not found" }), { status: 404 });
      }

      // ✅ Parse JSON fields before returning data
      const schema = {
        ...rows[0],
        headers: JSON.parse(rows[0].headers || "[]"),
        query_params: JSON.parse(rows[0].query_params || "[]"),
        request_body: JSON.parse(rows[0].request_body || "[]"),
        response_body: JSON.parse(rows[0].response_body || "[]"),
        response_codes: JSON.parse(rows[0].response_codes || "[]"),
      };

      return new Response(JSON.stringify(schema), { status: 200 });
    }

    // ✅ Fetch all schemas
    const [rows] = await pool.query("SELECT * FROM `api_schemas` ORDER BY created_at DESC");
    return new Response(JSON.stringify(rows), { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching schemas:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description, headers, query_params, request_body, response_body, response_codes } = await req.json();

    if (!name || !description) {
      return new Response(JSON.stringify({ error: "Name and Description are required" }), { status: 400 });
    }

    // ✅ Insert schema into the database
    const [result] = await pool.query(
      "INSERT INTO `api_schemas` (name, description, headers, query_params, request_body, response_body, response_codes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, JSON.stringify(headers), JSON.stringify(query_params), JSON.stringify(request_body), JSON.stringify(response_body), JSON.stringify(response_codes)]
    );

    return new Response(JSON.stringify({ id: result.insertId, message: "Schema added successfully" }), { status: 201 });

  } catch (error) {
    console.error("❌ Error adding schema:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, description, headers, query_params, request_body, response_body, response_codes } = await req.json();

    if (!id || !name || !description) {
      return new Response(JSON.stringify({ error: "ID, Name, and Description are required" }), { status: 400 });
    }

    // ✅ Update schema in database
    await pool.query(
      "UPDATE `api_schemas` SET name = ?, description = ?, headers = ?, query_params = ?, request_body = ?, response_body = ?, response_codes = ? WHERE id = ?",
      [name, description, JSON.stringify(headers), JSON.stringify(query_params), JSON.stringify(request_body), JSON.stringify(response_body), JSON.stringify(response_codes), id]
    );

    return new Response(JSON.stringify({ message: "Schema updated successfully" }), { status: 200 });

  } catch (error) {
    console.error("❌ Error updating schema:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Schema ID is required" }), { status: 400 });
    }

    // ✅ Delete schema from database
    await pool.query("DELETE FROM `api_schemas` WHERE id = ?", [id]);

    return new Response(JSON.stringify({ message: "Schema deleted successfully" }), { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting schema:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
