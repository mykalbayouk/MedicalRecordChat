import { NextResponse, NextRequest } from 'next/server';
import OpenAI from "openai";

export async function POST(request: NextRequest) {

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    });

    const params = await request.json();

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a health care professional analyizng a patient's medical record."
            },
            {
                role: "user",
                content: `Give me a summary of ${params.file}`
            }
        ],
        temperature: 0,
        max_tokens: 5096,
        frequency_penalty: 0,
        presence_penalty: 0
    });

    return NextResponse.json(response);
}