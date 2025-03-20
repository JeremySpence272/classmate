import { Extension, Editor, Range } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Terminal,
  ImagePlus,
  Columns as ColumnsIcon,
  Minus,
  TableIcon as TableCreateIcon,
} from "lucide-react";

// Initialize tippy as a variable that will be set in the component
let tippyInstance: any = null;

// Types
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

// Suggestion items
export const suggestionItems: SuggestionItem[] = [
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

// Slash command suggestion configuration
export const slashCommandSuggestion = {
  items: ({ query }: { query: string }) => {
    if (query === "") {
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

// Create the SlashCommand extension
export const SlashCommand = Extension.create({
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

// Initialize tippy
export const initializeTippy = () => {
  if (!tippyInstance) {
    import("tippy.js").then((tippyModule) => {
      tippyInstance = tippyModule.default;
    });
  }
};
