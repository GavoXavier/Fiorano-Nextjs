import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM apis");
    return Response.json(rows, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching APIs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, endpoint, method, categoryId, description } = await request.json();
    await pool.query(
      "INSERT INTO apis (name, endpoint, method, categoryId, description) VALUES (?, ?, ?, ?, ?)",
      [name, endpoint, method, categoryId, description]
    );

    return Response.json({ message: "API Created" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error creating API" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, endpoint, method, categoryId, description } = await request.json();
    await pool.query(
      "UPDATE apis SET name=?, endpoint=?, method=?, categoryId=?, description=? WHERE id=?",
      [name, endpoint, method, categoryId, description, id]
    );

    return Response.json({ message: "API Updated" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating API" }, { status: 500 });
  }
}
