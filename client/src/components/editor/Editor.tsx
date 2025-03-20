import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  EditorProvider,
  useCurrentEditor,
  BubbleMenu,
  JSONContent,
} from "@tiptap/react";
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
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import type { Instance as TippyInstance, Props as TippyProps } from "tippy.js";

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
import "@/app/_styles/editor.css";

// New import for Link extension
import Link from "@tiptap/extension-link";

// Import components
import EditorBubbleMenu from "./EditorBubbleMenu";
import { SlashCommand as SlashCommandExtension } from "./SlashCommand";

interface MenuBarProps {
  darkMode?: boolean;
}

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

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
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (buttonRef.current) {
        tippy(buttonRef.current, {
          content: tooltip,
          placement: "top",
          arrow: true,
          theme: "dark",
          offset: [0, 8],
          zIndex: 99999,
          animation: "fade",
          duration: 200,
          allowHTML: false,
          onCreate: ({ popper }) => {
            const tooltip = popper.querySelector(".tippy-box") as HTMLElement;
            if (tooltip) {
              tooltip.style.cssText = `
                background-color: rgba(24, 24, 27, 0.5) !important;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
              `;
            }
          },
        });
      }
    }, [tooltip]);

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
      <button
        ref={(node) => {
          // Handle both refs
          buttonRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onClick={onClick}
        disabled={disabled}
        className={isActive ? activeButtonClass : buttonClass}
      >
        {children}
      </button>
    );
  }
);

interface EditorProps {
  initialContent?: string | JSONContent;
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
let tippyInstance: typeof import("tippy.js").default | null = null;

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

// Define slashCommandSuggestion before using it in SlashCommand
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

        if (tippyInstance) {
          popup = tippyInstance(document.body, {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            theme: "dark",
            arrow: false,
            onCreate: ({ popper }: { popper: HTMLElement }) => {
              const tooltip = popper.querySelector(".tippy-box") as HTMLElement;
              if (tooltip) {
                tooltip.style.cssText = `
                  background-color: rgba(24, 24, 27, 0.5) !important;
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                `;
              }
            },
          });
        }
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

// Now define SlashCommand after slashCommandSuggestion
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
        ...slashCommandSuggestion,
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

const TipTapEditor: React.FC<EditorProps> = ({
  initialContent = defaultContent,
  darkMode = true,
  onChange,
}) => {
  const [processedContent, setProcessedContent] = useState<
    string | JSONContent
  >(defaultContent);

  useEffect(() => {
    // Initialize tippy immediately
    const initTippy = async () => {
      if (!tippyInstance) {
        const tippyModule = await import("tippy.js");
        tippyInstance = tippyModule.default;
      }
    };
    initTippy();
  }, []);

  useEffect(() => {
    // Add debug logs to see what we're receiving
    console.log("TipTapEditor initialContent:", initialContent);
    console.log("initialContent type:", typeof initialContent);

    // Process initialContent to ensure it's valid
    if (initialContent) {
      try {
        // If it's a valid JSONContent object with the required schema structure
        if (
          typeof initialContent === "object" &&
          initialContent !== null &&
          "type" in initialContent
        ) {
          console.log("Using JSONContent object directly");
          // Force a new reference to ensure the editor sees the change
          const contentCopy = JSON.parse(JSON.stringify(initialContent));
          setProcessedContent(contentCopy);
        } else if (typeof initialContent === "string") {
          // If it's a string, use as is (should be HTML)
          console.log("Using string content");
          setProcessedContent(initialContent);
        } else {
          // Fall back to default content if invalid
          console.warn("Invalid editor content format, using default");
          setProcessedContent(defaultContent);
        }
      } catch (error) {
        console.error("Error processing editor content:", error);
        setProcessedContent(defaultContent);
      }
    } else {
      console.log("No initialContent provided, using default");
      setProcessedContent(defaultContent);
    }
  }, [initialContent]);

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
      // Disable the built-in dropcursor to avoid duplication
      dropcursor: false,
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
        ...slashCommandSuggestion,
      },
    }),
    // Add columns extension
    ColumnsExtension,
  ];

  return (
    <div className="bg-transparent">
      <EditorProvider
        key={JSON.stringify(processedContent)}
        extensions={extensions}
        content={processedContent}
        onUpdate={({ editor }) => {
          onChange && onChange(editor.getHTML());
        }}
        editorProps={{
          attributes: {
            class: `tiptap focus:outline-none prose-sm sm:prose-base lg:prose-lg max-w-none`,
          },
        }}
        immediatelyRender={false}
      >
        <EditorBubbleMenu darkMode={darkMode} />
      </EditorProvider>
    </div>
  );
};

export default TipTapEditor;
