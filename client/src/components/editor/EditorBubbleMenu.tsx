import React, { useState, useRef, useEffect } from "react";
import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  FileCode,
  Quote,
  Link2,
  LayoutGrid,
  Highlighter,
  Bold,
  Italic,
  Strikethrough,
  ColumnsIcon,
  SquarePlus,
  Trash,
  Merge,
  Split,
} from "lucide-react";
import BubbleMenuButton from "./BubbleMenuButton";

interface EditorBubbleMenuProps {
  darkMode?: boolean;
}

const EditorBubbleMenu = ({ darkMode = true }: EditorBubbleMenuProps) => {
  const { editor } = useCurrentEditor();
  const [showHeadingOptions, setShowHeadingOptions] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const linkInputRef = useRef<HTMLInputElement>(null);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const headingButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const linkMenuRef = useRef<HTMLDivElement>(null);
  const tableButtonRef = useRef<HTMLButtonElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close heading dropdown when clicking outside
      if (
        headingMenuRef.current &&
        headingButtonRef.current &&
        !headingMenuRef.current.contains(event.target as Node) &&
        !headingButtonRef.current.contains(event.target as Node)
      ) {
        setShowHeadingOptions(false);
      }

      // Handle link menu clicks
      if (
        linkMenuRef.current &&
        linkButtonRef.current &&
        showLinkMenu &&
        !linkMenuRef.current.contains(event.target as Node) &&
        !linkButtonRef.current.contains(event.target as Node)
      ) {
        setShowLinkMenu(false);
      }

      // Handle table menu clicks
      if (
        tableMenuRef.current &&
        tableButtonRef.current &&
        showTableMenu &&
        !tableMenuRef.current.contains(event.target as Node) &&
        !tableButtonRef.current.contains(event.target as Node)
      ) {
        setShowTableMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHeadingOptions, showLinkMenu, showTableMenu]);

  // Focus the link input when the menu is shown
  useEffect(() => {
    if (showLinkMenu && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkMenu]);

  if (!editor) {
    return null;
  }

  // Update dropdown position when button is clicked
  const updateDropdownPosition = () => {
    if (headingButtonRef.current) {
      const rect = headingButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const addLink = () => {
    // If text is selected, show the link menu
    if (editor.state.selection.empty) {
      return;
    }

    // Get the current link URL if a link is selected
    if (editor.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setLinkUrl(attrs.href || "");
    } else {
      setLinkUrl("");
    }

    // Update position before toggling the menu
    if (linkButtonRef.current) {
      const rect = linkButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }

    setShowLinkMenu(!showLinkMenu);
  };

  const saveLink = () => {
    // If there's a valid URL, apply it
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl, target: "_blank" })
        .run();
    }

    // Reset and close the link menu
    setLinkUrl("");
    setShowLinkMenu(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowLinkMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveLink();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setShowLinkMenu(false);
    }
  };

  // Determine current paragraph/heading type
  const getActiveHeadingLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("paragraph")) return "Paragraph";
    return "Paragraph";
  };

  // Add function to handle columns
  const addColumns = () => {
    const count = window.prompt("How many columns? (2-4)", "2");
    const columnCount = parseInt(count || "2", 10);

    if (columnCount >= 2 && columnCount <= 4) {
      editor.chain().focus().setColumns(columnCount).run();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      className="bubble-menu z-[49]"
      tippyOptions={{
        duration: 100,
        maxWidth: "none",
        placement: "top",
        offset: [0, 10],
        zIndex: 49,
        appendTo: document.body,
        interactive: true,
      }}
    >
      <div className="flex items-center gap-1 p-1 bg-zinc-800 rounded-md shadow-lg border border-zinc-700">
        {/* Format Style Dropdown */}
        <div className="relative">
          <button
            ref={headingButtonRef}
            onClick={() => {
              setShowHeadingOptions(!showHeadingOptions);
              updateDropdownPosition();
              if (showLinkMenu) setShowLinkMenu(false);
            }}
            className="flex items-center gap-1 px-2 py-1 border border-zinc-700 rounded hover:bg-zinc-700 text-zinc-200 text-sm whitespace-nowrap"
          >
            {getActiveHeadingLabel()}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                showHeadingOptions ? "rotate-180" : ""
              }`}
            />
          </button>

          {showHeadingOptions &&
            createPortal(
              <div
                ref={headingMenuRef}
                style={{
                  position: "absolute",
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  zIndex: 9999,
                }}
                className="bg-zinc-800 border border-zinc-700 rounded shadow-lg p-1 min-w-[150px]"
              >
                <button
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setShowHeadingOptions(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 w-full text-left text-sm rounded ${
                    editor.isActive("paragraph")
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  <Pilcrow size={14} />
                  <span>Paragraph</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setShowHeadingOptions(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 w-full text-left text-sm rounded ${
                    editor.isActive("heading", { level: 1 })
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  <Heading1 size={14} />
                  <span>Heading 1</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setShowHeadingOptions(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 w-full text-left text-sm rounded ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  <Heading2 size={14} />
                  <span>Heading 2</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setShowHeadingOptions(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 w-full text-left text-sm rounded ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  <Heading3 size={14} />
                  <span>Heading 3</span>
                </button>
              </div>,
              document.body
            )}
        </div>

        <div className="w-px h-6 bg-zinc-700 mx-1"></div>

        {/* Text Formatting */}
        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold"
          darkMode={darkMode}
        >
          <Bold size={16} />
        </BubbleMenuButton>

        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic"
          darkMode={darkMode}
        >
          <Italic size={16} />
        </BubbleMenuButton>

        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
          darkMode={darkMode}
        >
          <Strikethrough size={16} />
        </BubbleMenuButton>

        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="Highlight"
          darkMode={darkMode}
        >
          <Highlighter size={16} />
        </BubbleMenuButton>

        <div className="w-px h-6 bg-zinc-700 mx-1"></div>

        {/* Link */}
        <div className="relative">
          <BubbleMenuButton
            ref={linkButtonRef}
            onClick={addLink}
            isActive={editor.isActive("link") || showLinkMenu}
            tooltip="Add Link"
            darkMode={darkMode}
          >
            <Link2 size={16} />
          </BubbleMenuButton>

          {showLinkMenu &&
            createPortal(
              <div
                ref={linkMenuRef}
                style={{
                  position: "absolute",
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  zIndex: 9999,
                }}
                className="bubble-link-dropdown bg-zinc-800 border border-zinc-700 rounded shadow-lg p-3 min-w-[320px]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Link2 size={16} className="text-zinc-400" />
                    <input
                      ref={linkInputRef}
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter URL"
                      className="bg-zinc-700 text-white px-3 py-1.5 rounded text-sm border border-zinc-600 flex-1"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    {editor.isActive("link") && (
                      <button
                        onClick={removeLink}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"
                      >
                        Remove
                      </button>
                    )}
                    <button
                      onClick={saveLink}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-medium"
                    >
                      Set Link
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>

        <div className="w-px h-6 bg-zinc-700 mx-1"></div>

        {/* Lists & Blocks */}
        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
          darkMode={darkMode}
        >
          <List size={16} />
        </BubbleMenuButton>

        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
          darkMode={darkMode}
        >
          <ListOrdered size={16} />
        </BubbleMenuButton>

        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Blockquote"
          darkMode={darkMode}
        >
          <Quote size={16} />
        </BubbleMenuButton>

        <BubbleMenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="Code Block"
          darkMode={darkMode}
        >
          <FileCode size={16} />
        </BubbleMenuButton>

        {/* Add Columns Button */}
        <BubbleMenuButton
          onClick={addColumns}
          isActive={editor.isActive("columnBlock")}
          tooltip="Columns Layout"
          darkMode={darkMode}
        >
          <ColumnsIcon size={16} />
        </BubbleMenuButton>

        {/* Add Table Tools Button and Menu */}
        {editor.isActive("table") && (
          <div className="relative">
            <BubbleMenuButton
              ref={tableButtonRef}
              onClick={() => {
                setShowTableMenu(!showTableMenu);
                if (tableButtonRef.current) {
                  const rect = tableButtonRef.current.getBoundingClientRect();
                  setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                  });
                }
                if (showLinkMenu) setShowLinkMenu(false);
                if (showHeadingOptions) setShowHeadingOptions(false);
              }}
              isActive={showTableMenu}
              tooltip="Table Tools"
              darkMode={darkMode}
            >
              <LayoutGrid size={16} />
            </BubbleMenuButton>

            {showTableMenu &&
              createPortal(
                <div
                  ref={tableMenuRef}
                  style={{
                    position: "absolute",
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    zIndex: 9999,
                  }}
                  className="bg-zinc-800 p-3 rounded border border-zinc-700 mb-2 grid grid-cols-3 gap-2 min-w-[320px]"
                >
                  <div className="col-span-1">
                    <div className="text-zinc-400 text-xs mb-1 uppercase tracking-wider">
                      Columns
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          editor.chain().focus().addColumnBefore().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Before</span>
                        <SquarePlus size={14} />
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().addColumnAfter().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>After</span>
                        <SquarePlus size={14} />
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().deleteColumn().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Delete</span>
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-zinc-400 text-xs mb-1 uppercase tracking-wider">
                      Rows
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          editor.chain().focus().addRowBefore().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Before</span>
                        <SquarePlus size={14} />
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().addRowAfter().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>After</span>
                        <SquarePlus size={14} />
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().deleteRow().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Delete</span>
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-zinc-400 text-xs mb-1 uppercase tracking-wider">
                      Cells
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          editor.chain().focus().mergeCells().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Merge</span>
                        <Merge size={14} />
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().splitCell().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Split</span>
                        <Split size={14} />
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().deleteTable().run();
                          setShowTableMenu(false);
                        }}
                        disabled={!editor.isActive("table")}
                        className="text-sm flex items-center justify-between bg-red-700 hover:bg-red-600 p-1.5 px-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Delete Table</span>
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
        )}
      </div>
    </BubbleMenu>
  );
};

export default EditorBubbleMenu;
