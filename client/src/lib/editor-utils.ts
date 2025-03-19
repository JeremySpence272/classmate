/**
 * Utilities for handling TipTap editor content
 */
import { JSONContent } from '@tiptap/react';
import { EditorContent } from './types';

/**
 * Converts a Markdown string to a TipTap JSON document structure
 * Used for legacy content migration
 * 
 * @param markdownContent The markdown content to convert
 * @returns A proper EditorContent object
 */
export function markdownToEditorContent(markdownContent: string): EditorContent {
  // This is a simple conversion that creates paragraphs for each line
  // In a real application, you might want to use a proper Markdown parser
  const paragraphs = markdownContent.split('\n\n').filter(p => p.trim().length > 0);
  
  const content: JSONContent[] = paragraphs.map(p => {
    // Identify headers
    if (p.startsWith('# ')) {
      return {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: p.substring(2).trim() }]
      };
    } else if (p.startsWith('## ')) {
      return {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: p.substring(3).trim() }]
      };
    } else if (p.startsWith('### ')) {
      return {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: p.substring(4).trim() }]
      };
    } else {
      // Simple paragraph
      return {
        type: 'paragraph',
        content: [{ type: 'text', text: p.trim() }]
      };
    }
  });

  return {
    type: 'doc',
    content,
    version: 1
  };
}

/**
 * Determines if content is in the EditorContent format or a plain string
 * 
 * @param content The content to check
 * @returns True if the content is EditorContent, false otherwise
 */
export function isEditorContent(content: EditorContent | string): content is EditorContent {
  return typeof content !== 'string' && content.type === 'doc' && !!content.content;
}

/**
 * Ensures content is in the EditorContent format
 * Converts string content to EditorContent if necessary
 * 
 * @param content The content to normalize
 * @returns EditorContent object
 */
export function normalizeContent(content: EditorContent | string): EditorContent {
  if (isEditorContent(content)) {
    return content;
  }
  
  return markdownToEditorContent(content);
}

/**
 * Converts EditorContent to a simple HTML string for display
 * Used when the editor is not available
 * 
 * @param content The EditorContent to convert
 * @returns HTML string
 */
export function editorContentToHtml(content: EditorContent | string): string {
  const normalizedContent = normalizeContent(content);
  
  // This is a very basic implementation
  // In a real application, you would want to use a proper HTML renderer
  let html = '';
  
  // Process each top-level node
  normalizedContent.content.forEach((node: JSONContent) => {
    if (node.type === 'paragraph') {
      html += `<p>${nodeContentToText(node)}</p>`;
    } else if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      html += `<h${level}>${nodeContentToText(node)}</h${level}>`;
    } else if (node.type === 'bulletList') {
      html += '<ul>';
      node.content?.forEach((listItem: JSONContent) => {
        html += `<li>${nodeContentToText(listItem)}</li>`;
      });
      html += '</ul>';
    } else if (node.type === 'orderedList') {
      html += '<ol>';
      node.content?.forEach((listItem: JSONContent) => {
        html += `<li>${nodeContentToText(listItem)}</li>`;
      });
      html += '</ol>';
    }
  });
  
  return html;
}

/**
 * Helper function to convert a node's content to plain text
 * 
 * @param node The JSON node
 * @returns Plain text representation
 */
function nodeContentToText(node: JSONContent): string {
  if (!node.content) return '';
  
  return node.content.map(child => {
    if (child.type === 'text') {
      return child.text || '';
    }
    return nodeContentToText(child);
  }).join('');
}

/**
 * Creates an empty EditorContent object
 * 
 * @returns Empty EditorContent
 */
export function createEmptyEditorContent(): EditorContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '' }]
      }
    ],
    version: 1
  };
}

/**
 * Creates an EditorContent object from JSONContent
 * Used when saving content from the editor
 * 
 * @param content The JSONContent to convert
 * @returns EditorContent object
 */
export function createEditorContent(content: JSONContent): EditorContent {
  return {
    type: 'doc',
    content: content,
    version: 1
  };
} 