// src/components/RichTextEditor.jsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  ImageIcon,
  Table2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  Minus,
} from "lucide-react";

export default function RichTextEditor({
  content = "",
  onChange,
  disabled = false,
}) {
  const editor = useEditor({
    immediatelyRender: false, // BẮT BUỘC với Next.js 15 + React 19
    extensions: [
      StarterKit.configure({
        heading: { levels: true, levels: [1, 2, 3, 4] },
        table: false,      // tắt table mặc định của StarterKit
        link: false,       // tránh duplicate
        underline: false,  // tránh duplicate
      }),

      // Custom lại những cái cần style riêng
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),

      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),

      // Bảng – BẮT BUỘC phải có đủ 4 dòng này trong Tiptap v3
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Color,

      Underline, // cần để nút gạch chân hoạt động
    ],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[350px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Đồng bộ nội dung khi props content thay đổi (rất quan trọng khi edit sản phẩm)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  // Dọn dẹp editor khi component unmount – CHỈ GỌI 1 LẦN DUY NHẤT
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Loading state
  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-8 min-h-[400px] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Đang tải editor...</p>
        </div>
      </div>
    );
  }

  // Các hàm hỗ trợ
  const setLink = () => {
    const url = window.prompt("Nhập URL:", editor.getAttributes("link").href || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Nhập URL hình ảnh:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const MenuButton = ({ onClick, active, disabled, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? "bg-blue-100 text-blue-600" : "text-gray-700"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} disabled={disabled} title="Bold">
          <Bold size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} disabled={disabled} title="Italic">
          <Italic size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} disabled={disabled} title="Underline">
          <UnderlineIcon size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} disabled={disabled} title="Strikethrough">
          <Strikethrough size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} disabled={disabled} title="Code">
          <Code size={18} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} disabled={disabled} title="Heading 1">
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} disabled={disabled} title="Heading 2">
          <Heading2 size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} disabled={disabled} title="Heading 3">
          <Heading3 size={18} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} disabled={disabled} title="Danh sách gạch đầu dòng">
          <List size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} disabled={disabled} title="Danh sách số">
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} disabled={disabled} title="Trích dẫn">
          <Quote size={18} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} disabled={disabled} title="Căn trái">
          <AlignLeft size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} disabled={disabled} title="Căn giữa">
          <AlignCenter size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} disabled={disabled} title="Căn phải">
          <AlignRight size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} disabled={disabled} title="Căn đều">
          <AlignJustify size={18} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={setLink} active={editor.isActive("link")} disabled={disabled} title="Chèn link">
          <Link2 size={18} />
        </MenuButton>
        <MenuButton onClick={addImage} disabled={disabled} title="Chèn ảnh">
          <ImageIcon size={18} />
        </MenuButton>
        <MenuButton onClick={addTable} disabled={disabled} title="Chèn bảng">
          <Table2 size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={disabled} title="Đường kẻ ngang">
          <Minus size={18} />
        </MenuButton>

        <Divider />

        <div className="flex items-center">
          <label className="cursor-pointer p-2 rounded hover:bg-gray-100" title="Màu chữ">
            <Palette size={18} className="text-gray-700" />
            <input
              type="color"
              className="sr-only"
              onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
              disabled={disabled}
            />
          </label>
        </div>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={disabled || !editor.can().undo()} title="Hoàn tác">
          <Undo size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={disabled || !editor.can().redo()} title="Làm lại">
          <Redo size={18} />
        </MenuButton>
      </div>

      {/* Nội dung editor */}
      <div className="p-4 min-h-[400px] overflow-y-auto">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
      </div>

      {/* Thanh trạng thái */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-600 flex justify-between items-center">
        <div className="flex gap-6">
          <span>{editor.getText().length} ký tự</span>
          <span>{editor.getText().split(/\s+/).filter(Boolean).length} từ</span>
        </div>

        {editor.isActive("table") && (
          <div className="flex gap-2">
            <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-2 py-1 bg-white border rounded hover:bg-gray-50" disabled={disabled}>+ Cột trước</button>
            <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 py-1 bg-white border rounded hover:bg-gray-50" disabled={disabled}>+ Cột sau</button>
            <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="px-2 py-1 bg-white border rounded hover:bg-gray-50" disabled={disabled}>+ Hàng trước</button>
            <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2 py-1 bg-white border rounded hover:bg-gray-50" disabled={disabled}>+ Hàng sau</button>
            <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100" disabled={disabled}>Xóa bảng</button>
          </div>
        )}
      </div>
    </div>
  );
}