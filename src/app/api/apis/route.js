import pool from "@/lib/db"; // Import MySQL Connection Pool

// ✅ GET: Fetch all APIs or a specific API by ID
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Fetch a specific API
      const [rows] = await pool.query("SELECT * FROM `api_v2` WHERE id = ?", [id]);

      if (rows.length === 0) {
        return new Response(JSON.stringify({ message: "API not found" }), { status: 404 });
      }

      // Parse JSON fields before returning
      const api = {
        ...rows[0],
        headers: JSON.parse(rows[0].headers || "[]"),
        query_params: JSON.parse(rows[0].query_params || "[]"),
        request_body: JSON.parse(rows[0].request_body || "[]"),
        response_body: JSON.parse(rows[0].response_body || "[]"),
        status_codes: JSON.parse(rows[0].status_codes || "[]"),
        example_request_body: JSON.parse(rows[0].example_request_body || "{}"),
        example_response_body: JSON.parse(rows[0].example_response_body || "{}"),
      };

      return new Response(JSON.stringify(api), { status: 200 });
    }

    // Fetch all APIs
    const [rows] = await pool.query("SELECT * FROM `api_v2` ORDER BY created_at DESC");
    
    // Parse JSON fields for all records
    const apis = rows.map((api) => ({
      ...api,
      headers: JSON.parse(api.headers || "[]"),
      query_params: JSON.parse(api.query_params || "[]"),
      request_body: JSON.parse(api.request_body || "[]"),
      response_body: JSON.parse(api.response_body || "[]"),
      status_codes: JSON.parse(api.status_codes || "[]"),
      example_request_body: JSON.parse(api.example_request_body || "{}"),
      example_response_body: JSON.parse(api.example_response_body || "{}"),
    }));

    return new Response(JSON.stringify(apis), { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching APIs:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// ✅ POST: Add a new API
export async function POST(req) {
  try {
    const {
      name,
      endpoint,
      method,
      category_id,
      schema_id,
      requires_auth,
      description,
      headers,
      query_params,
      request_body,
      response_body,
      status_codes,
      example_request_body,
      example_response_body,
      example_integration,
    } = await req.json();

    if (!name || !endpoint || !method || !category_id) {
      return new Response(JSON.stringify({ error: "Required fields missing" }), { status: 400 });
    }

    // Ensure JSON fields are correctly formatted
    const sanitizedHeaders = JSON.stringify(headers || []);
    const sanitizedQueryParams = JSON.stringify(query_params || []);
    const sanitizedRequestBody = JSON.stringify(request_body || []);
    const sanitizedResponseBody = JSON.stringify(response_body || []);
    const sanitizedStatusCodes = JSON.stringify(status_codes || []);
    const sanitizedExampleRequestBody = JSON.stringify(example_request_body || {});
    const sanitizedExampleResponseBody = JSON.stringify(example_response_body || {});

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO api_v2 
        (name, endpoint, method, category_id, schema_id, requires_auth, description, 
        headers, query_params, request_body, response_body, status_codes, 
        example_request_body, example_response_body, example_integration) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        endpoint,
        method,
        category_id,
        schema_id,
        requires_auth,
        description,
        sanitizedHeaders,
        sanitizedQueryParams,
        sanitizedRequestBody,
        sanitizedResponseBody,
        sanitizedStatusCodes,
        sanitizedExampleRequestBody,
        sanitizedExampleResponseBody,
        example_integration,
      ]
    );

    return new Response(JSON.stringify({ id: result.insertId, message: "API added successfully" }), { status: 201 });

  } catch (error) {
    console.error("❌ Error adding API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// ✅ PUT: Update an existing API
export async function PUT(req) {
  try {
    const {
      id,
      name,
      endpoint,
      method,
      category_id,
      schema_id,
      requires_auth,
      description,
      headers,
      query_params,
      request_body,
      response_body,
      status_codes,
      example_request_body,
      example_response_body,
      example_integration,
    } = await req.json();

    if (!id || !name || !endpoint || !method || !category_id) {
      return new Response(JSON.stringify({ error: "Required fields missing" }), { status: 400 });
    }

    // Ensure JSON fields are formatted correctly
    const sanitizedHeaders = JSON.stringify(headers || []);
    const sanitizedQueryParams = JSON.stringify(query_params || []);
    const sanitizedRequestBody = JSON.stringify(request_body || []);
    const sanitizedResponseBody = JSON.stringify(response_body || []);
    const sanitizedStatusCodes = JSON.stringify(status_codes || []);
    const sanitizedExampleRequestBody = JSON.stringify(example_request_body || {});
    const sanitizedExampleResponseBody = JSON.stringify(example_response_body || {});

    // Update database
    await pool.query(
      `UPDATE api_v2 SET 
        name = ?, endpoint = ?, method = ?, category_id = ?, schema_id = ?, requires_auth = ?, description = ?, 
        headers = ?, query_params = ?, request_body = ?, response_body = ?, status_codes = ?, 
        example_request_body = ?, example_response_body = ?, example_integration = ? 
        WHERE id = ?`,
      [
        name,
        endpoint,
        method,
        category_id,
        schema_id,
        requires_auth,
        description,
        sanitizedHeaders,
        sanitizedQueryParams,
        sanitizedRequestBody,
        sanitizedResponseBody,
        sanitizedStatusCodes,
        sanitizedExampleRequestBody,
        sanitizedExampleResponseBody,
        example_integration,
        id,
      ]
    );

    return new Response(JSON.stringify({ message: "API updated successfully" }), { status: 200 });

  } catch (error) {
    console.error("❌ Error updating API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// ✅ DELETE: Remove an API
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "API ID is required" }), { status: 400 });
    }

    await pool.query("DELETE FROM api_v2 WHERE id = ?", [id]);

    return new Response(JSON.stringify({ message: "API deleted successfully" }), { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
