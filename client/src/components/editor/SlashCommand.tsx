import { Extension, Editor, Range } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import React, {
  useState,
  useEffect,
  ReactNode,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { createRoot, Root } from "react-dom/client";
import tippy, { Instance } from "tippy.js";
import "tippy.js/dist/tippy.css";
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

// Suggestion item interface
export interface SuggestionItem {
  title: string;
  description: string;
  icon: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

// Suggestion props interface for the popup component
export interface SuggestionProps {
  items: SuggestionItem[];
  command: (item: SuggestionItem | null) => void;
  editor: Editor;
  range: Range;
  clientRect?: () => DOMRect;
  event?: KeyboardEvent;
}

// Props for ReactRenderer
export interface ReactRendererProps {
  props: SuggestionProps;
  editor: Editor;
}

// Define a type for the forwarded ref from SlashCommandsList
export interface SlashCommandsListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

// A helper class to render React components into a popup element
export class ReactRenderer {
  component: React.ComponentType<SuggestionProps>;
  element: HTMLElement;
  ref: SlashCommandsListRef | null = null;
  props: SuggestionProps;
  editor: Editor;
  root: Root;

  constructor(
    component: React.ComponentType<SuggestionProps>,
    { props, editor }: ReactRendererProps
  ) {
    this.component = component;
    this.element = document.createElement("div");
    this.props = props;
    this.editor = editor;
    this.root = createRoot(this.element);
    this.render();
  }

  updateProps(props: Partial<SuggestionProps>) {
    this.props = { ...this.props, ...props };
    this.render();
  }

  render() {
    // Cast Component as a ForwardRef component so we can pass the ref prop
    const Component = this.component as React.ForwardRefExoticComponent<
      SuggestionProps & React.RefAttributes<SlashCommandsListRef>
    >;
    this.root.render(
      <Component
        {...this.props}
        editor={this.editor}
        ref={(ref: SlashCommandsListRef | null) => {
          this.ref = ref;
        }}
      />
    );
  }

  destroy() {
    this.root.unmount();
  }
}

// The slash commands list component rendered inside the popup
const SlashCommandsList = forwardRef<SlashCommandsListRef, SuggestionProps>(
  ({ items, command, editor, range }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const commandListRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLButtonElement>(null);

    // Expose an onKeyDown handler via ref that always returns false
    useImperativeHandle(ref, () => ({
      onKeyDown: () => false,
    }));

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % items.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        } else if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          const item = items[selectedIndex];
          if (item) {
            item.command({ editor, range });
          }
          command(null);
        } else if (e.key === "Escape") {
          e.preventDefault();
          command(null);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, items, command, editor, range]);

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
              onClick={() => {
                item.command({ editor, range });
                command(null);
              }}
            >
              <div className="flex-shrink-0 mr-2 text-zinc-400">
                {item.icon}
              </div>
              <div>
                <div className="text-sm text-zinc-200">{item.title}</div>
                <div className="text-xs text-zinc-400">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

SlashCommandsList.displayName = "SlashCommandsList";

// The list of suggestion items available in the slash command menu
export const suggestionItems: SuggestionItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Horizontal Line",
    description: "Add a horizontal divider",
    icon: <Minus size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "Blockquote",
    description: "Add a quote block",
    icon: <Quote size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Add a code block",
    icon: <Terminal size={18} />,
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Table",
    description: "Add a table",
    icon: <TableCreateIcon size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
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
        editor.chain().deleteRange(range).setImage({ src: url }).run();
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
        editor.chain().deleteRange(range).setColumns(columnCount).run();
      }
    },
  },
];

// The slash command suggestion configuration object
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
    let popup: Instance;
    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SlashCommandsList, {
          props,
          editor: props.editor,
        });
        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        }) as Instance;
      },
      onUpdate: (props: SuggestionProps) => {
        component.updateProps(props);
        popup.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },
      onKeyDown: (props: SuggestionProps) => {
        if (props.event && props.event.key === "Escape") {
          popup.hide();
          return true;
        }
        return props.event && component.ref && component.ref.onKeyDown
          ? component.ref.onKeyDown(props.event)
          : false;
      },
      onExit: () => {
        popup.destroy();
        component.destroy();
      },
    };
  },
};

// Finally, create the SlashCommand extension
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
          props: {
            command: (payload: { editor: Editor; range: Range }) => void;
          };
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: slashCommandSuggestion.items,
        render: slashCommandSuggestion.render,
      }),
    ];
  },
});
