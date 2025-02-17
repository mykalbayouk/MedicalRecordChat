'use client';
import { useState } from "react";
import DragAndDropUpload from "../../components/dragDrop";
import pdfToText from 'react-pdftotext'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

interface Message {
    role: string;
    content: string;
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState<Message[] | null>([]);

    const handleFileChange = (file: any) => {
        setFile(file[0]);
    };

    const handleClose = () => {
        setOpen(false);
        setChat([]);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const input = document.getElementById("chat-input") as HTMLInputElement;
        if (input) {
            const newMessage: Message = {
            role: "user",
            content: input.value
            };
            setChat(prevChat => [...(prevChat || []), newMessage]);
            input.value = "";
            try {
            const response = await fetch("/api/chattp", {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: newMessage.content }),
            });
            const data = await response.json();
            const responseMessage: Message = {
                role: "system",
                content: data.choices[0].message.content
            };
            setChat(prevChat => [...(prevChat || []), responseMessage]);
            } catch (error) {
            console.error("Error calling AI API:", error);
            }
        }
        

    }

    const handleUpload = async (event: any) => {
        event.preventDefault();
        setOpen(true);
        if (file === null) {
            window.alert('Please Select a File');
            return;
        }
        if (file) {
            let text = await extractText(file);
            const startIndex = text.indexOf("CLINICAL INFORMATION");

            if (startIndex !== -1) {
                text = text.substring(startIndex);
                text = cleanText(text);
            } else {
                console.log("Required text not found in the document.");
            }
            try {
                const response = await fetch("/api/gpt", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ file: text }),
                });
                const data = await response.json();
                const responseMessage: Message = {
                    role: "system",
                    content: data.choices[0].message.content
                };
                setChat([responseMessage]);
            } catch (error) {
                console.error("Error calling AI API:", error);
            }
        }
    }


    return (
        <div className="bg-white text-black">
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="bg-gray-200 shadow-lg rounded-lg p-8 max-w-lg w-full mx-4 sm:mx-auto">
                    <h1 className="text-bold text-4xl text-center mb-6 font-bold">Add File</h1>
                    <form className="space-y-6">
                        <div className="w-full">
                            <DragAndDropUpload onUploadComplete={handleFileChange} />
                        </div>
                        <button
                            onClick={handleUpload}
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded-lg transition duration-150 hover:bg-blue-600"
                        >
                            Upload
                        </button>
                        <Modal open={open} onClose={handleClose}>
                            <Box sx={{
                                position: 'relative',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                height: '90%',
                                bgcolor: '#FFFFFFFF',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: '8px',
                                color: 'black',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Box sx={{
                                    width: '50%',
                                    height: '100%',
                                    borderRight: '1px solid #ccc',
                                    padding: '16px',
                                    overflowY: 'auto'
                                }}>
                                    <h2 className="text-xl font-bold mb-4">Chat</h2>
                                    <div id="chat-window" className="flex-grow overflow-y-auto mb-4">
                                    <div className="flex flex-col space-y-2">
                                        {chat?.map((message, index) => (
                                            <div key={index} className={`p-2 rounded ${message.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
                                                <span dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                                            </div>
                                        ))}
                                    </div>
                                    </div>
                                    <form onSubmit={handleSubmit} className="flex flex-col">
                                        <label htmlFor="chat-input" className="sr-only">Message</label>
                                        <input type="text" id="chat-input" className="w-full p-2 mb-2 border border-gray-300 rounded" placeholder="Type your message..." />
                                        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Send</button>
                                    </form>
                                </Box>
                                <Box sx={{
                                    width: '50%',
                                    height: '100%',
                                    padding: '16px',
                                    overflowY: 'auto'
                                }}>
                                    <h2 className="text-xl font-bold mb-4">PDF Viewer</h2>
                                    <iframe src={file ? URL.createObjectURL(file) : ''} style={{ width: '100%', height: '100%' }}></iframe>
                                </Box>
                            </Box>
                        </Modal>
                    </form>
                </div>
            </div>
        </div>
    )
}

function formatMessage(content: string): string {
    // Replace markdown-like syntax with HTML tags
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic
    content = content.replace(/__(.*?)__/g, "<u>$1</u>"); // Underline
    content = content.replace(/~~(.*?)~~/g, "<del>$1</del>"); // Strikethrough
    content = content.replace(/\n/g, "<br>"); // Newline to <br>

    return content;
}

function extractText(file: any): Promise<string> {
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

function cleanText(text: string): string {
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
