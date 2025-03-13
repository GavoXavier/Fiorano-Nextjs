// import pool from "@/lib/db"; // MySQL Connection Pool

// // ✅ GET: Fetch all APIs or a specific API
// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const id = url.searchParams.get("id");

//     if (id) {
//       // ✅ Fetch specific API
//       const [rows] = await pool.query("SELECT * FROM `api_v2` WHERE id = ?", [id]);

//       if (rows.length === 0) {
//         return new Response(JSON.stringify({ message: "API not found" }), { status: 404 });
//       }

//       // ✅ Parse JSON fields before returning
//       const api = {
//         ...rows[0],
//         headers: JSON.parse(rows[0].headers || "[]"),
//         query_params: JSON.parse(rows[0].query_params || "[]"),
//         request_body: JSON.parse(rows[0].request_body || "[]"),
//         request_example: JSON.parse(rows[0].request_example || "{}"),
//         response_body: JSON.parse(rows[0].response_body || "[]"),
//         response_example: JSON.parse(rows[0].response_example || "{}"),
//         response_codes: JSON.parse(rows[0].response_codes || "[]"),
//       };

//       return new Response(JSON.stringify(api), { status: 200 });
//     }

//     // ✅ Fetch all APIs
//     const [rows] = await pool.query(`
//       SELECT api_v2.*, categories.name AS category_name
//       FROM api_v2
//       JOIN categories ON api_v2.category_id = categories.id
//       ORDER BY api_v2.created_at DESC
//     `);

//     // ✅ Parse JSON fields for each API
//     const apis = rows.map((api) => ({
//       ...api,
//       headers: JSON.parse(api.headers || "[]"),
//       query_params: JSON.parse(api.query_params || "[]"),
//       request_body: JSON.parse(api.request_body || "[]"),
//       request_example: JSON.parse(api.request_example || "{}"),
//       response_body: JSON.parse(api.response_body || "[]"),
//       response_example: JSON.parse(api.response_example || "{}"),
//       response_codes: JSON.parse(api.response_codes || "[]"),
//     }));

//     return new Response(JSON.stringify(apis), { status: 200 });

//   } catch (error) {
//     console.error("❌ Error fetching APIs:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
//   }
// }

// // ✅ POST: Add a new API
// export async function POST(req) {
//   try {
//     const {
//       name, endpoint, method, description, category_id, schema_id,
//       headers, query_params, request_body, request_example,
//       response_body, response_example, response_codes, curl_example
//     } = await req.json();

//     if (!name || !endpoint || !method || !category_id) {
//       return new Response(JSON.stringify({ error: "Name, Endpoint, Method, and Category are required" }), { status: 400 });
//     }

//     // ✅ Ensure JSON formatting
//     const sanitizedHeaders = JSON.stringify(headers || []);
//     const sanitizedQueryParams = JSON.stringify(query_params || []);
//     const sanitizedRequestBody = JSON.stringify(request_body || []);
//     const sanitizedRequestExample = JSON.stringify(request_example || {});
//     const sanitizedResponseBody = JSON.stringify(response_body || []);
//     const sanitizedResponseExample = JSON.stringify(response_example || {});
//     const sanitizedResponseCodes = JSON.stringify(response_codes || []);

//     // ✅ Insert API into the database
//     const [result] = await pool.query(
//       "INSERT INTO `api_v2` (name, endpoint, method, description, category_id, schema_id, headers, query_params, request_body, request_example, response_body, response_example, response_codes, curl_example) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [name, endpoint, method, description, category_id, schema_id, sanitizedHeaders, sanitizedQueryParams, sanitizedRequestBody, sanitizedRequestExample, sanitizedResponseBody, sanitizedResponseExample, sanitizedResponseCodes, curl_example]
//     );

//     return new Response(JSON.stringify({ id: result.insertId, message: "API added successfully" }), { status: 201 });

//   } catch (error) {
//     console.error("❌ Error adding API:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
//   }
// }

// // ✅ PUT: Update an existing API
// export async function PUT(req) {
//   try {
//     const {
//       id, name, endpoint, method, description, category_id, schema_id,
//       headers, query_params, request_body, request_example,
//       response_body, response_example, response_codes, curl_example
//     } = await req.json();

//     if (!id || !name || !endpoint || !method || !category_id) {
//       return new Response(JSON.stringify({ error: "ID, Name, Endpoint, Method, and Category are required" }), { status: 400 });
//     }

//     // ✅ Ensure JSON formatting
//     const sanitizedHeaders = JSON.stringify(headers || []);
//     const sanitizedQueryParams = JSON.stringify(query_params || []);
//     const sanitizedRequestBody = JSON.stringify(request_body || []);
//     const sanitizedRequestExample = JSON.stringify(request_example || {});
//     const sanitizedResponseBody = JSON.stringify(response_body || []);
//     const sanitizedResponseExample = JSON.stringify(response_example || {});
//     const sanitizedResponseCodes = JSON.stringify(response_codes || []);

//     // ✅ Update API in the database
//     await pool.query(
//       "UPDATE `api_v2` SET name = ?, endpoint = ?, method = ?, description = ?, category_id = ?, schema_id = ?, headers = ?, query_params = ?, request_body = ?, request_example = ?, response_body = ?, response_example = ?, response_codes = ?, curl_example = ? WHERE id = ?",
//       [name, endpoint, method, description, category_id, schema_id, sanitizedHeaders, sanitizedQueryParams, sanitizedRequestBody, sanitizedRequestExample, sanitizedResponseBody, sanitizedResponseExample, sanitizedResponseCodes, curl_example, id]
//     );

//     return new Response(JSON.stringify({ message: "API updated successfully" }), { status: 200 });

//   } catch (error) {
//     console.error("❌ Error updating API:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
//   }
// }

// // ✅ DELETE: Remove an API
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ error: "API ID is required" }), { status: 400 });
//     }

//     // ✅ Delete API from database
//     await pool.query("DELETE FROM `api_v2` WHERE id = ?", [id]);

//     return new Response(JSON.stringify({ message: "API deleted successfully" }), { status: 200 });

//   } catch (error) {
//     console.error("❌ Error deleting API:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
//   }
// }



import pool from "@/lib/db"; // MySQL Connection Pool

// ✅ GET: Fetch all APIs or a specific API
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // ✅ Fetch specific API
      const [rows] = await pool.query("SELECT * FROM `api_v2` WHERE id = ?", [id]);

      if (rows.length === 0) {
        return new Response(JSON.stringify({ message: "API not found" }), { status: 404 });
      }

      // ✅ Return data exactly as stored
      const api = {
        ...rows[0],
        headers: JSON.parse(rows[0].headers || "[]"),
        query_params: JSON.parse(rows[0].query_params || "[]"),
        request_body: JSON.parse(rows[0].request_body || "[]"),
        request_example: rows[0].request_example || "{}", // ✅ Keep as raw JSON string
        response_body: JSON.parse(rows[0].response_body || "[]"),
        response_example: rows[0].response_example || "{}", // ✅ Keep as raw JSON string
        response_codes: JSON.parse(rows[0].response_codes || "[]"),
      };

      return new Response(JSON.stringify(api), { status: 200 });
    }

    // ✅ Fetch all APIs
    const [rows] = await pool.query(`
      SELECT api_v2.*, categories.name AS category_name
      FROM api_v2
      JOIN categories ON api_v2.category_id = categories.id
      ORDER BY api_v2.created_at DESC
    `);

    // ✅ Ensure correct JSON formatting
    const apis = rows.map((api) => ({
      ...api,
      headers: JSON.parse(api.headers || "[]"),
      query_params: JSON.parse(api.query_params || "[]"),
      request_body: JSON.parse(api.request_body || "[]"),
      request_example: api.request_example || "{}", // ✅ Keep as raw JSON string
      response_body: JSON.parse(api.response_body || "[]"),
      response_example: api.response_example || "{}", // ✅ Keep as raw JSON string
      response_codes: JSON.parse(api.response_codes || "[]"),
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
      name, endpoint, method, description, category_id, schema_id,
      headers, query_params, request_body, request_example,
      response_body, response_example, response_codes, curl_example
    } = await req.json();

    if (!name || !endpoint || !method || !category_id) {
      return new Response(JSON.stringify({ error: "Name, Endpoint, Method, and Category are required" }), { status: 400 });
    }

    // ✅ Store request/response examples as raw JSON
    const sanitizedRequestExample = request_example ? request_example.trim() : "{}";
    const sanitizedResponseExample = response_example ? response_example.trim() : "{}";

    // ✅ Insert API into the database
    const [result] = await pool.query(
      "INSERT INTO `api_v2` (name, endpoint, method, description, category_id, schema_id, headers, query_params, request_body, request_example, response_body, response_example, response_codes, curl_example) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, endpoint, method, description, category_id, schema_id, JSON.stringify(headers || []), JSON.stringify(query_params || []), JSON.stringify(request_body || []), sanitizedRequestExample, JSON.stringify(response_body || []), sanitizedResponseExample, JSON.stringify(response_codes || []), curl_example]
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
      id, name, endpoint, method, description, category_id, schema_id,
      headers, query_params, request_body, request_example,
      response_body, response_example, response_codes, curl_example
    } = await req.json();

    if (!id || !name || !endpoint || !method || !category_id) {
      return new Response(JSON.stringify({ error: "ID, Name, Endpoint, Method, and Category are required" }), { status: 400 });
    }

    // ✅ Store request/response examples as raw JSON
    const sanitizedRequestExample = request_example ? request_example.trim() : "{}";
    const sanitizedResponseExample = response_example ? response_example.trim() : "{}";

    // ✅ Update API in the database
    await pool.query(
      "UPDATE `api_v2` SET name = ?, endpoint = ?, method = ?, description = ?, category_id = ?, schema_id = ?, headers = ?, query_params = ?, request_body = ?, request_example = ?, response_body = ?, response_example = ?, response_codes = ?, curl_example = ? WHERE id = ?",
      [name, endpoint, method, description, category_id, schema_id, JSON.stringify(headers || []), JSON.stringify(query_params || []), JSON.stringify(request_body || []), sanitizedRequestExample, JSON.stringify(response_body || []), sanitizedResponseExample, JSON.stringify(response_codes || []), curl_example, id]
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

    // ✅ Delete API from database
    await pool.query("DELETE FROM `api_v2` WHERE id = ?", [id]);

    return new Response(JSON.stringify({ message: "API deleted successfully" }), { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
