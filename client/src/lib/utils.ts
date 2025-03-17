import { ClassType } from "@/lib/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import showdown from "showdown";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a time string from 24-hour format (HH:MM) to 12-hour format with AM/PM
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Gets the appropriate CSS classes for a class type
 */
export function getClassTypeStyles(type: ClassType): { bg: string; border: string } {
  const styles = {
    lecture: {
      bg: "bg-blue-800",
      border: "border-blue-950",
    },
    lab: {
      bg: "bg-green-800",
      border: "border-green-950",
    },
    seminar: {
      bg: "bg-amber-800",
      border: "border-amber-950",
    },
    discussion: {
      bg: "bg-purple-800",
      border: "border-purple-950",
    },
  };

  return styles[type] || { bg: "bg-zinc-800", border: "border-zinc-950" };
}

/**
 * Applies Tailwind classes to HTML elements
 */
function applyTailwindClasses(html: string): string {
  // Replace heading tags with styled versions
  html = html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h1 class="text-white scroll-m-20 text-4xl font-extrabold tracking-tight mb-6 pb-2 border-b border-zinc-700/50 lg:text-5xl">$1</h1>');
  html = html.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h2 class="text-white mt-10 scroll-m-20 border-b border-zinc-700/50 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">$1</h2>');
  html = html.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<h3 class="text-white mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">$1</h3>');
  html = html.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '<h4 class="text-white mt-6 scroll-m-20 text-xl font-semibold tracking-tight">$1</h4>');
  
  // Replace paragraph tags
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, '<p class="text-zinc-200 leading-7 [&:not(:first-child)]:mt-6">$1</p>');
  
  // Replace links
  html = html.replace(/<a([^>]*)>(.*?)<\/a>/gi, '<a$1 class="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4">$2</a>');
  
  // Replace blockquotes
  html = html.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '<blockquote class="text-zinc-300 my-6 border-l-2 border-zinc-600 pl-6 italic">$1</blockquote>');
  
  // Replace lists
  html = html.replace(/<ul[^>]*>(.*?)<\/ul>/gi, '<ul class="text-zinc-200 my-6 ml-6 list-disc [&>li]:mt-2">$1</ul>');
  html = html.replace(/<ol[^>]*>(.*?)<\/ol>/gi, '<ol class="text-zinc-200 my-6 ml-6 list-decimal [&>li]:mt-2">$1</ol>');
  
  // Replace tables
  html = html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, '<div class="my-6 w-full overflow-y-auto bg-zinc-900/50 rounded-md border border-zinc-800"><table class="w-full">$1</table></div>');
  html = html.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, '<tr class="m-0 border-t border-zinc-800 p-0 bg-zinc-800/30">$1</tr>');
  html = html.replace(/<th[^>]*>(.*?)<\/th>/gi, '<th class="text-white border border-zinc-800 bg-zinc-800/70 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">$1</th>');
  html = html.replace(/<td[^>]*>(.*?)<\/td>/gi, '<td class="text-zinc-200 border border-zinc-800 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">$1</td>');
  
  // Style code and pre elements
  html = html.replace(/<code[^>]*>(.*?)<\/code>/gi, '<code class="relative rounded bg-zinc-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-zinc-200">$1</code>');
  html = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '<pre class="mb-4 mt-4 overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-zinc-200">$1</pre>');
  
  // Style list items
  html = html.replace(/<li[^>]*>(.*?)<\/li>/gi, '<li class="text-zinc-200">$1</li>');
  
  // Style strong and em
  html = html.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<strong class="font-bold text-white">$1</strong>');
  html = html.replace(/<em[^>]*>(.*?)<\/em>/gi, '<em class="italic text-zinc-300">$1</em>');
  
  // Style horizontal rule
  html = html.replace(/<hr[^>]*>/gi, '<hr class="my-6 border-zinc-700" />');
  
  return html;
}

/**
 * Converts markdown content to styled HTML with Tailwind classes
 */
export function markdownToStyledHtml(markdown: string): string {
  // Create a showdown converter
  const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    strikethrough: true,
  });

  // Convert markdown to HTML
  let html = converter.makeHtml(markdown);
  
  // Apply tailwind classes to HTML elements
  html = applyTailwindClasses(html);
  
  return html;
}
