import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const userMessages = body?.messages || [];
  const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;

  const functions: OpenAI.Chat.ChatCompletionCreateParams.Function[] = [
    {
      name: "list",
      description:
        "list queries books by genre, and returns a list of names of books",
      parameters: {
        type: "object",
        properties: {
          genre: {
            type: "string",
            enum: ["mystery", "nonfiction", "memoir", "romance", "historical"],
          },
        },
      },
    },
    {
      name: "search",
      description:
        "search queries books by their name and returns a list of book names and their ids",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
    },
    {
      name: "get",
      description:
        "get returns a book's detailed information based on the id of the book. Note that this does not accept names, and only IDs, which you can get by using search.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
    },
    {
      name: "swap",
      description: "Get the trade_info_from_chat",
      parameters: {
        type: "object",
        properties: {
          fromToken: {
            type: "string",
            description: "from Token Symbol",
          },
          toToken: {
            type: "string",
            description: "to Token Symbol",
          },
          amount: {
            type: "string",
            description: "amount",
          },
        },
        required: ["fromToken", "toToken", "amount"],
      },
    },
  ];

  async function callFunction(
    function_call: ChatCompletionMessage.FunctionCall
  ): Promise<any> {
    const args = JSON.parse(function_call.arguments!);
    switch (function_call.name) {
      case "list":
        return await list(args["genre"]);

      case "search":
        return await search(args["name"]);

      case "get":
        return await get(args["id"]);

      case "swap":
        return await swap(args["fromToken"], args["toToken"], args["amount"]);

      default:
        throw new Error("No function found");
    }
  }

  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You're an assistant that takes natural language and helps with cryptocurrency transactions. For example, if I say 'exchange 1 ETH for 1 USDC', you need to structure it into JSON.",
      },
      userMessages[userMessages.length - 1],
    ];

    // while (true) {
    const completion = await openai.chat.completions.create({
      model: model.id,
      messages,
      functions: functions,
    });

    const message = completion.choices[0]!.message;
    messages.push(message);

    if (!message.function_call) {
      res.status(200).json(messages[messages.length - 1]);
      return;
    } else {
      // If there is a function call, we generate a new message with the role 'function'.
      const result = await callFunction(message.function_call);
      const newMessage = {
        role: "function" as const,
        name: message.function_call.name!,
        content: result,
      };
      messages.push(newMessage);
      console.log("newMessage : ", newMessage);
      res.status(200).json(newMessage);
    }
    console.log("all messages : ", messages);
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during ping to OpenAI. Please try again.",
    });
    return;
  }
}

const db = [
  {
    id: "a1",
    name: "To Kill a Mockingbird",
    genre: "historical",
    description: `Compassionate, dramatic, and deeply moving, "To Kill A Mockingbird" takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.`,
  },
  {
    id: "a2",
    name: "All the Light We Cannot See",
    genre: "historical",
    description: `In a mining town in Germany, Werner Pfennig, an orphan, grows up with his younger sister, enchanted by a crude radio they find that brings them news and stories from places they have never seen or imagined. Werner becomes an expert at building and fixing these crucial new instruments and is enlisted to use his talent to track down the resistance. Deftly interweaving the lives of Marie-Laure and Werner, Doerr illuminates the ways, against all odds, people try to be good to one another.`,
  },
  {
    id: "a3",
    name: "Where the Crawdads Sing",
    genre: "historical",
    description: `For years, rumors of the “Marsh Girl” haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her.

But Kya is not what they say. A born naturalist with just one day of school, she takes life's lessons from the land, learning the real ways of the world from the dishonest signals of fireflies. But while she has the skills to live in solitude forever, the time comes when she yearns to be touched and loved. Drawn to two young men from town, who are each intrigued by her wild beauty, Kya opens herself to a new and startling world—until the unthinkable happens.`,
  },
];

async function list(genre: string) {
  return db
    .filter((item) => item.genre === genre)
    .map((item) => ({ name: item.name, id: item.id }));
}

async function search(name: string) {
  return db
    .filter((item) => item.name.includes(name))
    .map((item) => ({ name: item.name, id: item.id }));
}

async function get(id: string) {
  return db.find((item) => item.id === id)!;
}

async function swap(fromToken: string, toToken: string, amount: string) {
  try {
    return {
      fromToken: fromToken,
      toToken: toToken,
      amount: amount,
    };
  } catch (error) {
    console.log(error);
  }

  return "call swap function";
}
