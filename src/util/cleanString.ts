export default function cleanText(text: string): string {
    // Remove URLs
    text = text.replace(/https?:\/\/[^\s]+/g, "");

    // Remove page numbers (assuming they are in the format "Page X" or "Page X of Y")
    text = text.replace(/Page \d+(\s+of\s+\d+)?/gi, "");

    // Remove phone numbers (assuming they are in the format (123) 456-7890 or 123-456-7890)
    text = text.replace(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g, "");

    // Remove extra whitespace and newlines
    text = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();

    return text;
}