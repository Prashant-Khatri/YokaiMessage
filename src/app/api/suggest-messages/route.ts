import { google } from '@ai-sdk/google'
import { streamObject } from 'ai'
import z from 'zod'
export async function POST(req : Request){
  try {
    const result= streamObject({
      model: google('gemini-2.5-flash'),
      output : 'array',
      schema : z.string(),
      prompt: "Create a list of three open-ended and engaging questions formatted as string. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be an array containing questions like this: ['What’s a hobby you’ve recently started?','If you could have dinner with any historical figure, who would it be?','What’s a simple thing that makes you happy?']. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
    });
    return result.toTextStreamResponse();
  } catch (error) {
    return Response.json({
      success : false,
      message : "Error in fetching suggestions"
    },{status : 500})
  }
}