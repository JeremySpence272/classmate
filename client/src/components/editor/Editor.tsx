import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import React, { useState, useEffect } from "react";
import { ColumnsExtension } from "@tiptap-extend/columns";
import "tippy.js/dist/tippy.css";
import { Editor, Range } from "@tiptap/core";

// Table extensions
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

// Highlight extension
import Highlight from "@tiptap/extension-highlight";

// Image and Dropcursor
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";

// Link extension
import Link from "@tiptap/extension-link";

// Import editor styles
import "@/app/_styles/editor.css";

// Import the working BubbleMenu component
import EditorBubbleMenu from "./EditorBubbleMenu";

// Import the custom SlashCommand extension
import { SlashCommand } from "./SlashCommand";

// Define props for the editor component
interface EditorProps {
  initialContent?: string | JSONContent;
  darkMode?: boolean;
  onChange?: (html: string) => void;
}

const defaultContent = `<h2>Start typing here...</h2>
<p>This is a <em>basic</em> example of <strong>TipTap</strong>. Type <strong>/</strong> to open the command menu.</p>`;

const TipTapEditor: React.FC<EditorProps> = ({
  initialContent = defaultContent,
  darkMode = true,
  onChange,
}) => {
  const [processedContent, setProcessedContent] = useState<
    string | JSONContent
  >(defaultContent);

  useEffect(() => {
    // Process initial content – either JSONContent or HTML string
    if (initialContent) {
      try {
        if (
          typeof initialContent === "object" &&
          initialContent !== null &&
          "type" in initialContent
        ) {
          const contentCopy = JSON.parse(JSON.stringify(initialContent));
          setProcessedContent(contentCopy);
        } else if (typeof initialContent === "string") {
          setProcessedContent(initialContent);
        } else {
          setProcessedContent(defaultContent);
        }
      } catch (error) {
        console.error("Error processing editor content:", error);
        setProcessedContent(defaultContent);
      }
    } else {
      setProcessedContent(defaultContent);
    }
  }, [initialContent]);

  // TipTap extensions array – note the SlashCommand is included and typed properly
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: { keepMarks: true, keepAttributes: false },
      orderedList: { keepMarks: true, keepAttributes: false },
      dropcursor: false, // disable default dropcursor to avoid duplication
    }),
    Placeholder.configure({ placeholder: "Start typing here..." }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Highlight.configure({ multicolor: false }),
    Link.configure({
      openOnClick: false,
      linkOnPaste: true,
      HTMLAttributes: { class: "editor-link" },
    }),
    Image,
    Dropcursor,
    // SlashCommand extension – note the command now uses a proper type
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
          props: {
            command: (payload: { editor: Editor; range: Range }) => void;
          };
        }) => {
          props.command({ editor, range });
        },
      },
    }),
    ColumnsExtension,
  ];

  return (
    <div className="bg-transparent">
      <EditorProvider
        key={JSON.stringify(processedContent)}
        extensions={extensions}
        content={processedContent}
        onUpdate={({ editor }) => onChange && onChange(editor.getHTML())}
        editorProps={{
          attributes: {
            class:
              "tiptap focus:outline-none prose-sm sm:prose-base lg:prose-lg max-w-none",
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
