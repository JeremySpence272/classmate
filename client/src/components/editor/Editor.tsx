import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor, BubbleMenu } from "@tiptap/react";
import { Editor, Extension, Range } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Suggestion } from "@tiptap/suggestion";
import ReactDOM from "react-dom/client";
import { createRoot, Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { ColumnsExtension } from "@tiptap-extend/columns";

// Icons
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  X,
  Trash2,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  FileCode,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Table as TableIcon,
  ChevronDown,
  SquarePlus,
  Rows3,
  Trash,
  Merge,
  Split,
  LayoutGrid,
  Highlighter,
  Link as LinkIcon,
  Link2,
  ExternalLink,
  Terminal,
  Code2,
  ImagePlus,
  TableIcon as TableCreateIcon,
  Columns as ColumnsIcon,
  Minus,
} from "lucide-react";

// Table extensions
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

// Add highlight extension
import Highlight from "@tiptap/extension-highlight";

// Image extensions
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";

// Import editor styles
import "./Editor.css";

// New import for Link extension
import Link from "@tiptap/extension-link";

interface MenuBarProps {
  darkMode?: boolean;
}

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

// Simple tooltip component
const Tooltip: React.FC<TooltipProps> = ({ children, tooltip }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-10">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
      </div>
    </div>
  );
};

const EditorButton = React.forwardRef<
  HTMLButtonElement,
  {
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean;
    tooltip: string;
    darkMode?: boolean;
    className?: string;
    children: React.ReactNode;
  }
>(
  (
    {
      onClick,
      disabled = false,
      isActive = false,
      tooltip,
      darkMode = true,
      className = "",
      children,
    },
    ref
  ) => {
    const baseClass = `p-1.5 rounded text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-center w-9 h-9 ${className}`;

    const buttonClass = `${baseClass} ${
      darkMode
        ? "hover:bg-zinc-700 text-zinc-200 border border-transparent hover:border-zinc-600"
        : "hover:bg-gray-100 text-zinc-800 border border-transparent hover:border-gray-300"
    }`;

    const activeButtonClass = `${baseClass} ${
      darkMode
        ? "bg-zinc-700 text-white border border-zinc-600"
        : "bg-gray-100 text-black border border-gray-400"
    }`;

    return (
      <Tooltip tooltip={tooltip}>
        <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={isActive ? activeButtonClass : buttonClass}
        >
          {children}
        </button>
      </Tooltip>
    );
  }
);

const MenuBar = ({ darkMode = true }: MenuBarProps) => {
  const { editor } = useCurrentEditor();
  const [showTableMenu, setShowTableMenu] = useState(false);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Add function to create columns
  const addColumns = () => {
    const count = window.prompt("How many columns? (2-4)", "2");
    const columnCount = parseInt(count || "2", 10);

    if (columnCount >= 2 && columnCount <= 4) {
      editor.chain().focus().setColumns(columnCount).run();
    }
  };

  return (
    <div className="mb-4 border-b border-zinc-700 pb-4">
      <div className="flex flex-wrap items-center gap-1 mb-2">
        {/* Text Formatting Group */}
        <div className="flex items-center mr-3 border-r border-zinc-700 pr-3">
          <EditorButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="Bold (Ctrl+B)"
            darkMode={darkMode}
          >
            <Bold size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="Italic (Ctrl+I)"
            darkMode={darkMode}
          >
            <Italic size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            tooltip="Strikethrough"
            darkMode={darkMode}
          >
            <Strikethrough size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            tooltip="Highlight"
            darkMode={darkMode}
          >
            <Highlighter size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            tooltip="Inline Code"
            darkMode={darkMode}
          >
            <Code size={18} />
          </EditorButton>
        </div>

        {/* Structure Group */}
        <div className="flex items-center mr-3 border-r border-zinc-700 pr-3">
          <EditorButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
            tooltip="Paragraph"
            darkMode={darkMode}
          >
            <Pilcrow size={18} />
          </EditorButton>

          <EditorButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            tooltip="Heading 1"
            darkMode={darkMode}
          >
            <Heading1 size={18} />
          </EditorButton>

          <EditorButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            tooltip="Heading 2"
            darkMode={darkMode}
          >
            <Heading2 size={18} />
          </EditorButton>

          <EditorButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            tooltip="Heading 3"
            darkMode={darkMode}
          >
            <Heading3 size={18} />
          </EditorButton>
        </div>

        {/* Lists Group */}
        <div className="flex items-center mr-3 border-r border-zinc-700 pr-3">
          <EditorButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Bullet List"
            darkMode={darkMode}
          >
            <List size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Numbered List"
            darkMode={darkMode}
          >
            <ListOrdered size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Blockquote"
            darkMode={darkMode}
          >
            <Quote size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            tooltip="Code Block"
            darkMode={darkMode}
          >
            <FileCode size={18} />
          </EditorButton>
        </div>

        {/* Tools Group - Add the Columns button here */}
        <div className="flex items-center mr-3 border-r border-zinc-700 pr-3">
          <EditorButton
            onClick={addImage}
            tooltip="Insert Image"
            darkMode={darkMode}
          >
            <ImageIcon size={18} />
          </EditorButton>

          <EditorButton
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            tooltip="Insert Table"
            darkMode={darkMode}
          >
            <TableIcon size={18} />
          </EditorButton>

          <EditorButton
            onClick={addColumns}
            tooltip="Add Columns"
            darkMode={darkMode}
            isActive={editor.isActive("columnBlock")}
          >
            <ColumnsIcon size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => setShowTableMenu(!showTableMenu)}
            isActive={showTableMenu}
            tooltip={showTableMenu ? "Hide Table Tools" : "Table Tools"}
            darkMode={darkMode}
            className="relative"
          >
            <LayoutGrid size={18} />
            <ChevronDown
              size={14}
              className={`absolute bottom-0 right-0 transition-transform ${
                showTableMenu ? "rotate-180" : ""
              }`}
            />
          </EditorButton>
        </div>

        {/* History Group */}
        <div className="flex items-center">
          <EditorButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            tooltip="Undo"
            darkMode={darkMode}
          >
            <Undo size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            tooltip="Redo"
            darkMode={darkMode}
          >
            <Redo size={18} />
          </EditorButton>

          <EditorButton
            onClick={() => editor.chain().focus().clearNodes().run()}
            tooltip="Clear Formatting"
            darkMode={darkMode}
          >
            <Trash2 size={18} />
          </EditorButton>
        </div>
      </div>

      {/* Table Menu */}
      {showTableMenu && (
        <div className="bg-zinc-800 p-3 rounded border border-zinc-700 mb-2 grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <div className="text-zinc-400 text-xs mb-1 uppercase tracking-wider">
              Columns
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Before</span>
                <SquarePlus size={14} />
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>After</span>
                <SquarePlus size={14} />
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
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
                onClick={() => editor.chain().focus().addRowBefore().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Before</span>
                <SquarePlus size={14} />
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>After</span>
                <SquarePlus size={14} />
              </button>
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
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
                onClick={() => editor.chain().focus().mergeCells().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Merge</span>
                <Merge size={14} />
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-zinc-700 hover:bg-zinc-600 p-1.5 px-2 rounded text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Split</span>
                <Split size={14} />
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.isActive("table")}
                className="text-sm flex items-center justify-between bg-red-700 hover:bg-red-600 p-1.5 px-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Delete Table</span>
                <Trash size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EditorProps {
  initialContent?: string;
  darkMode?: boolean;
  onChange?: (html: string) => void;
}

const defaultContent = `
<h2>
  Start typing here...
</h2>
<p>
  This is a <em>basic</em> example of <strong>TipTap</strong>. You can format text and create structured content.
</p>
<p>
  Type <strong>/</strong> to open the command menu for formatting options.
</p>
<ul>
  <li>
    Create bullet lists
  </li>
  <li>
    Format text in various ways
  </li>
</ul>
<p>
  You can add <mark>highlighted text</mark> for important information and <a href="https://tiptap.dev" class="editor-link">links to websites</a>.
</p>
<p>
  Add code blocks:
</p>
<pre><code class="language-js">console.log('Hello world!');</code></pre>
<p>
  Include images:
</p>
<img src="https://placehold.co/600x200/27272a/ffffff?text=Example+Image" />
<p>
  And create multi-column layouts:
</p>
<div class="column-block" data-type="columnBlock" data-columns="2">
  <div class="column" data-type="column">
    <h3>First Column</h3>
    <p>This is the content for the first column. You can add any kind of content here including lists, images, and more.</p>
  </div>
  <div class="column" data-type="column">
    <h3>Second Column</h3>
    <p>This is the content for the second column. Columns are great for creating side-by-side comparisons or layouts.</p>
  </div>
</div>
<p>
  Add horizontal lines to separate content:
</p>
<hr>
<p>
  And create tables:
</p>
<table>
  <tbody>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Category</th>
    </tr>
    <tr>
      <td>Biology</td>
      <td>Study of living organisms</td>
      <td>Science</td>
    </tr>
    <tr>
      <td>History</td>
      <td>Study of past events</td>
      <td>Humanities</td>
    </tr>
  </tbody>
</table>
`;

// Slash command interface definitions
interface SuggestionItem {
  title: string;
  description: string;
  icon: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

interface SuggestionProps {
  items: SuggestionItem[];
  command: (item: SuggestionItem | null) => void;
  editor: Editor;
  range: Range;
  clientRect?: () => DOMRect;
  event?: KeyboardEvent;
}

interface ReactRendererProps {
  props: SuggestionProps;
  editor: Editor;
}

// Initialize tippy as a variable that will be set in the component
let tippyInstance: any = null;

// Slash command implementation
const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          if (props && typeof props.command === "function") {
            props.command({ editor, range });
          }
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

// Reorder the suggestion items to place horizontal line in a more visible position
const suggestionItems: SuggestionItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Horizontal Line",
    description: "Add a horizontal divider",
    icon: <Minus size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "Blockquote",
    description: "Add a quote block",
    icon: <Quote size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Add a code block",
    icon: <Terminal size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Table",
    description: "Add a table",
    icon: <TableCreateIcon size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: "Image",
    description: "Insert an image",
    icon: <ImagePlus size={18} />,
    command: ({ editor, range }) => {
      const url = window.prompt("Enter image URL");

      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
      }
    },
  },
  {
    title: "Columns",
    description: "Add a multi-column layout",
    icon: <ColumnsIcon size={18} />,
    command: ({ editor, range }) => {
      const count = window.prompt("How many columns? (2-4)", "2");
      const columnCount = parseInt(count || "2", 10);

      if (columnCount >= 2 && columnCount <= 4) {
        editor.chain().focus().deleteRange(range).setColumns(columnCount).run();
      }
    },
  },
];

// Create the slash command menu component
const SlashCommandsList = ({
  items,
  command,
  editor,
  range,
}: SuggestionProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandListRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((selectedIndex + 1) % items.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
      }

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectItem(selectedIndex);
      }

      if (e.key === "Escape") {
        e.preventDefault();
        command(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, items, command]);

  useEffect(() => {
    if (selectedItemRef.current && commandListRef.current) {
      const itemElement = selectedItemRef.current;
      const listElement = commandListRef.current;

      const scrollTop = listElement.scrollTop;
      const listHeight = listElement.offsetHeight;
      const itemTop = itemElement.offsetTop - listElement.offsetTop;
      const itemHeight = itemElement.offsetHeight;

      if (itemTop < scrollTop) {
        listElement.scrollTop = itemTop;
      } else if (itemTop + itemHeight > scrollTop + listHeight) {
        listElement.scrollTop = itemTop + itemHeight - listHeight;
      }
    }
  }, [selectedIndex]);

  const selectItem = (index: number) => {
    const item = items[index];

    if (item) {
      if (item.command && editor && range) {
        item.command({ editor, range });
      }

      if (command) {
        command(null);
      }
    }
  };

  return (
    <div
      className="slash-commands-menu bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden shadow-lg"
      style={{ width: "260px" }}
      ref={commandListRef}
    >
      <div className="py-1 max-h-80 overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={index}
            ref={index === selectedIndex ? selectedItemRef : null}
            className={`w-full flex items-center px-3 py-2 text-left ${
              index === selectedIndex ? "bg-zinc-700" : "hover:bg-zinc-700"
            }`}
            onClick={() => selectItem(index)}
          >
            <div className="flex-shrink-0 mr-2 text-zinc-400">{item.icon}</div>
            <div>
              <div className="text-sm text-zinc-200">{item.title}</div>
              <div className="text-xs text-zinc-400">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Update the slashCommandSuggestion.items to display more items and not filter out horizontal line
const slashCommandSuggestion = {
  items: ({ query }: { query: string }) => {
    if (query === "") {
      // Show all items if there's no query
      return suggestionItems;
    }

    return suggestionItems.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  },

  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SlashCommandsList, {
          props,
          editor: props.editor,
        });

        popup = tippyInstance("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })[0];
      },

      onUpdate: (props: SuggestionProps) => {
        component.updateProps(props);

        popup.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown: (props: SuggestionProps) => {
        if (props.event?.key === "Escape") {
          popup.hide();
          return true;
        }

        return component.ref?.onKeyDown(props.event);
      },

      onExit: () => {
        popup.destroy();
        component.destroy();
      },
    };
  },
};

// Helper class for rendering React components in popup
class ReactRenderer {
  component: any;
  element: HTMLElement;
  ref: any;
  props: any;
  editor: Editor;
  root: Root;

  constructor(component: any, { props, editor }: ReactRendererProps) {
    this.component = component;
    this.element = document.createElement("div");
    this.props = props;
    this.editor = editor;
    this.root = createRoot(this.element);
    this.render();
  }

  updateProps(props: any) {
    this.props = {
      ...this.props,
      ...props,
    };
    this.render();
  }

  render() {
    const Component = this.component;
    this.root.render(
      <Component
        {...this.props}
        editor={this.editor}
        ref={(ref: any) => (this.ref = ref)}
      />
    );
  }

  destroy() {
    this.root.unmount();
  }
}

// Component to handle the bubble menu
const EditorBubbleMenu = ({ darkMode = true }: { darkMode?: boolean }) => {
  const { editor } = useCurrentEditor();
  const [showHeadingOptions, setShowHeadingOptions] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const linkInputRef = useRef<HTMLInputElement>(null);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const headingButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const linkMenuRef = useRef<HTMLDivElement>(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHeadingOptions, showLinkMenu]);

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
      className="bubble-menu"
      tippyOptions={{
        duration: 100,
        maxWidth: "none",
        placement: "top",
        offset: [0, 10],
        zIndex: 99,
        appendTo: document.body,
        interactive: true,
        popperOptions: {
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                padding: 10,
                boundary: document.body,
              },
            },
          ],
        },
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
        <EditorButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold"
          darkMode={darkMode}
        >
          <Bold size={16} />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic"
          darkMode={darkMode}
        >
          <Italic size={16} />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
          darkMode={darkMode}
        >
          <Strikethrough size={16} />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="Highlight"
          darkMode={darkMode}
        >
          <Highlighter size={16} />
        </EditorButton>

        <div className="w-px h-6 bg-zinc-700 mx-1"></div>

        {/* Link */}
        <div className="relative">
          <EditorButton
            ref={linkButtonRef}
            onClick={addLink}
            isActive={editor.isActive("link") || showLinkMenu}
            tooltip="Add Link"
            darkMode={darkMode}
          >
            <Link2 size={16} />
          </EditorButton>

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
        <EditorButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
          darkMode={darkMode}
        >
          <List size={16} />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
          darkMode={darkMode}
        >
          <ListOrdered size={16} />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Blockquote"
          darkMode={darkMode}
        >
          <Quote size={16} />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="Code Block"
          darkMode={darkMode}
        >
          <FileCode size={16} />
        </EditorButton>

        {/* Add Columns Button */}
        <EditorButton
          onClick={addColumns}
          isActive={editor.isActive("columnBlock")}
          tooltip="Columns Layout"
          darkMode={darkMode}
        >
          <ColumnsIcon size={16} />
        </EditorButton>
      </div>
    </BubbleMenu>
  );
};

const TipTapEditor: React.FC<EditorProps> = ({
  initialContent = defaultContent,
  darkMode = true,
  onChange,
}) => {
  useEffect(() => {
    // Import tippy dynamically to avoid server/client mismatch
    if (!tippyInstance) {
      import("tippy.js").then((tippyModule) => {
        tippyInstance = tippyModule.default;
      });
    }
  }, []);

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Placeholder.configure({
      placeholder: "Start typing here...",
    }),
    // Table extensions
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    // Replace task list extensions with highlight
    Highlight.configure({
      multicolor: false,
    }),
    // Link extension
    Link.configure({
      openOnClick: false,
      linkOnPaste: true,
      HTMLAttributes: {
        class: "editor-link",
      },
    }),
    // Image extensions
    Image,
    Dropcursor,
    // Slash command extension
    SlashCommand.configure({
      suggestion: slashCommandSuggestion,
    }),
    // Add columns extension
    ColumnsExtension,
  ];

  return (
    <div
      className={`border ${
        darkMode ? "border-zinc-700 bg-zinc-900" : "border-gray-300 bg-white"
      } rounded-lg p-4`}
    >
      <EditorProvider
        extensions={extensions}
        content={initialContent}
        onUpdate={({ editor }) => {
          onChange && onChange(editor.getHTML());
        }}
        editorProps={{
          attributes: {
            class: `tiptap focus:outline-none prose-sm sm:prose-base lg:prose-lg max-w-none`,
          },
        }}
      >
        <EditorBubbleMenu darkMode={darkMode} />
      </EditorProvider>
    </div>
  );
};

export default TipTapEditor;
