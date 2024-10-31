import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { DallEAPIWrapper } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({
  temperature: 0.9,
  openAIApiKey: process.env.OPENAI_API_KEY,
  streaming: true,
});

// The temperature parameter (0 - 2) affects how imaginative our model gets. The higher, the more creative. The lower, the more factual. So if you were brainstorming catchy titles for stories, you may want a higher number. If you want accuracy like summarizing a legal document, you want lower. We'll put this in the middle.

// This is our POST request.
// Pass in the request, get the subject, invoke the LLM with the subject, and return the response.

const dallE = new DallEAPIWrapper({
  n: 1, // Default
  apiKey: process.env.OPENAI_API_KEY, // Default
});

export async function POST(req) {
  // converts JS strings to their binary representations. Used to send data over a network or writing to a file, or in a streamed response from an API
  const encoder = new TextEncoder();

  // This creates a writeable and readable stream. It's used to transform data as it passes through from the writable side to the readable side
  const stream = new TransformStream();

  // Gets a writer for the writeable side of the TransformStream. Allows us to write.
  const writer = stream.writable.getWriter();

  const { subject } = await req.json();
  let content;
  const promptTemplate = PromptTemplate.fromTemplate(
    "Tell me a short, family-friendly, halloween story about {subject}"
  );

  const chain = RunnableSequence.from([
    promptTemplate,
    llm,
    (llmOutput) => {
      content = llmOutput.content;
      return llmOutput.content;
    },
    dallE,
  ]);

  const image = chain.invoke(
    {
      subject,
    },
    {
      callbacks: [
        {
          handleLLMNewToken: async (token) => {
            await writer.ready;
            await writer.write(encoder.encode(`${token}`));
          },
          handleToolEnd: async (imageUrl) => {
            await writer.ready;
            await writer.write(
              encoder.encode(JSON.stringify({ imageUrl: imageUrl }))
            );
            await writer.close();
          },
        },
      ],
    }
  );

  return new Response(stream.readable, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
