import pdfToText from "react-pdftotext";

export default function extractText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (file) {
            pdfToText(file)
                .then((text: string) => resolve(text))
                .catch((error: Error) => reject("Failed to extract text from pdf: " + error));
        } else {
            reject("No file provided");
        }
    });
}