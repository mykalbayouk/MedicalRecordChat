export default function formatMessage(content: string): string {
    // Replace markdown-like syntax with HTML tags
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic
    content = content.replace(/__(.*?)__/g, "<u>$1</u>"); // Underline
    content = content.replace(/~~(.*?)~~/g, "<del>$1</del>"); // Strikethrough
    content = content.replace(/\n/g, "<br>"); // Newline to <br>

    return content;
}