import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, slug, description, icon, is_active, display_order } = body;

    const queryText = `
      UPDATE services
      SET 
        title = $1,
        slug = $2,
        description = $3,
        icon = $4,
        is_active = $5,
        display_order = $6
      WHERE id = $7
      RETURNING *
    `;

    const result = await query(queryText, [
      title,
      slug,
      description,
      icon,
      is_active,
      display_order,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy dịch vụ", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Cập nhật dịch vụ thành công"
    });

  } catch (error) {
    console.error("❌ Error updating service:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Có lỗi xảy ra khi cập nhật dịch vụ",
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const queryText = `
      DELETE FROM services
      WHERE id = $1
      RETURNING id
    `;

    const result = await query(queryText, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy dịch vụ",
          message: "ID không tồn tại"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa dịch vụ thành công",
      deletedId: id
    });

  } catch (error) {
    console.error("❌ Error deleting service:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Có lỗi xảy ra khi xóa dịch vụ",
        message: error.message
      },
      { status: 500 }
    );
  }
}
