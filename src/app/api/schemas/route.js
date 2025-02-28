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

    // Ensure all JSON fields are parsed properly
    const schemas = rows.map((schema) => ({
      ...schema,
      headers: JSON.parse(schema.headers || "[]"),
      query_params: JSON.parse(schema.query_params || "[]"),
      request_body: JSON.parse(schema.request_body || "[]"),
      response_body: JSON.parse(schema.response_body || "[]"),
      response_codes: JSON.parse(schema.response_codes || "[]"),
    }));

    return new Response(JSON.stringify(schemas), { status: 200 });

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

    // ✅ Ensure proper JSON formatting for arrays
    const sanitizedHeaders = JSON.stringify(headers || []);
    const sanitizedQueryParams = JSON.stringify(query_params || []);
    const sanitizedRequestBody = JSON.stringify(request_body || []);
    const sanitizedResponseBody = JSON.stringify(response_body || []);
    const sanitizedResponseCodes = JSON.stringify(response_codes || []);

    // ✅ Insert schema into the database
    const [result] = await pool.query(
      "INSERT INTO `api_schemas` (name, description, headers, query_params, request_body, response_body, response_codes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, sanitizedHeaders, sanitizedQueryParams, sanitizedRequestBody, sanitizedResponseBody, sanitizedResponseCodes]
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

    // ✅ Ensure all fields are stored correctly
    const sanitizedHeaders = JSON.stringify(headers || []);
    const sanitizedQueryParams = JSON.stringify(query_params || []);
    const sanitizedRequestBody = JSON.stringify(request_body || []);
    const sanitizedResponseBody = JSON.stringify(response_body || []);
    const sanitizedResponseCodes = JSON.stringify(response_codes || []);

    // ✅ Update schema in the database
    await pool.query(
      "UPDATE `api_schemas` SET name = ?, description = ?, headers = ?, query_params = ?, request_body = ?, response_body = ?, response_codes = ? WHERE id = ?",
      [name, description, sanitizedHeaders, sanitizedQueryParams, sanitizedRequestBody, sanitizedResponseBody, sanitizedResponseCodes, id]
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
