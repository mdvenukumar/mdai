import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { headers } from 'next/headers';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestLog.get(ip) || [];
  
  // Clean up old requests
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  // Update request log
  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return false;
}

export async function POST(request: Request) {
  try {
    // Get client IP
    const forwardedFor = headers().get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { topic } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key configuration error' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `Generate a detailed and well-structured markdown document about "${topic}".

Structure the content as follows:

# ${topic}

[Introduction: Write a compelling introduction that sets the context and importance of the topic]

## Overview
[Provide a high-level overview of the main concepts]

## Key Features/Components
[List and explain the main features or components]

## Implementation/Usage
[If applicable, include practical examples, code snippets, or usage instructions]

## Best Practices
[Share recommended practices and guidelines]

## Common Challenges and Solutions
[Address typical problems and their solutions]

## Future Perspectives
[Discuss future trends or potential developments]

## Conclusion
[Summarize key points and provide closing thoughts]

Important guidelines:
1. Use proper markdown syntax throughout
2. Include relevant code examples if the topic is technical
3. Use bullet points and numbered lists for better readability
4. Add emphasis using **bold** and *italic* where appropriate
5. Include \`inline code\` and code blocks where relevant
6. Keep the content informative yet concise
7. Maintain a professional tone throughout

Make the content engaging and valuable for both beginners and experienced users.`;

    console.log('Sending request to Groq API...');
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 0.9,
      stream: false,
    });

    const generatedContent = chatCompletion.choices[0]?.message?.content;

    if (!generatedContent) {
      console.error('No content generated from Groq API');
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      );
    }

    console.log('Content generated successfully');
    return NextResponse.json({ 
      content: generatedContent,
      message: 'Content generated successfully'
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('api key')) {
        return NextResponse.json(
          { error: 'Authentication error' },
          { status: 401 }
        );
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
}
