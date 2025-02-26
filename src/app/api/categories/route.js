import pool from "../../../lib/db";

// ✅ GET: Fetch all categories
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, name, description FROM categories ORDER BY id DESC");
    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error("❌ [GET] Error fetching categories:", error);
    return Response.json({ error: "Error fetching categories", details: error.message }, { status: 500 });
  }
}

// ✅ POST: Add a new category
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return Response.json({ error: "Name and Description are required" }, { status: 400 });
    }

    const [result] = await pool.query("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description]);
    return Response.json({ message: "Category Added Successfully", id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("❌ [POST] Error adding category:", error);
    return Response.json({ error: "Error adding category", details: error.message }, { status: 500 });
  }
}

// ✅ PUT: Update an existing category
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;

    if (!id || !name || !description) {
      return Response.json({ error: "ID, Name, and Description are required" }, { status: 400 });
    }

    await pool.query("UPDATE categories SET name = ?, description = ? WHERE id = ?", [name, description, id]);
    return Response.json({ message: "Category Updated Successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ [PUT] Error updating category:", error);
    return Response.json({ error: "Error updating category", details: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Remove a category
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: "Category ID is required" }, { status: 400 });
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return Response.json({ message: "Category Deleted Successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ [DELETE] Error deleting category:", error);
    return Response.json({ error: "Error deleting category", details: error.message }, { status: 500 });
  }
}
