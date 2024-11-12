import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, CommaSeparatedListOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";


const llm = new ChatOpenAI({
    // We want it to be a little creative
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

const zodSchema = z.object({
    question: z.string().describe("Give me a random sports trivia question."),
    answers: z
        .array(z.string())
        .describe("Give me 4 possible answers, 3 false and 1 correct, in random order."),
    correctIndex: z.number().describe("Number of the correct answer, zero indexed."),
});

const parser = StructuredOutputParser.fromZodSchema(zodSchema);

const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
        "Answer the user question as best as possible.\n{format_instructions}"
    ),
    llm,
    parser
])

const generateQuestionAndAnswers = async() => {
    return await chain.invoke({
        format_instructions: parser.getFormatInstructions()
    })
}

export async function GET() {
	const data = await generateQuestionAndAnswers()
	return Response.json({ data });
}

