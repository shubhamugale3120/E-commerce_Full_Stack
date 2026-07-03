import OpenAI from "openai";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    await connectDB();
    // const { query } = await req.json();
    // const aiResponse = await client.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         { role: "user", content: "Convert this into a short product keyword" + query },
    //     ]
    // });
    // const keyword = aiResponse.choices[0].message.content.trim().split(',').map(k => k.trim());
    // const keywordRegex = keyword.join('|'); // Join keywords with '|' for regex OR search
    // const products = await Product.find({
    //     $or: [
    //         { title: { $regex: keywordRegex, $options: "i" } },
    //         { description: { $regex: keywordRegex, $options: "i" } },
    //         { category: { $regex: keywordRegex, $options: "i" } }
    //     ]
    // });

    const result = await Product.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",// Name of the vector index
                patch: "embedding", // Field containing the vector embeddings
                queryVector: queryEmbedding, // The vector to search for
                numCandidates: 10, // Number of candidates to retrieve
                limit: 5, // Limit the number of results returned
            }
        },{
            $project: {
                title: 1,
                description: 1,
                price: 1,
                category: 1,
                image: 1,
                score: { $meta: "vectorSearchScore" } // Include the vector search score in the results
            }
        }
    ])

    return Response.json({ results: result }, { status: 200 });
}

/**
 * this is a POST request handler for an AI-powered product search API. It takes a user query, generates a short product keyword using OpenAI's GPT-3.5-turbo model, and then searches the MongoDB database for products that match the generated keyword in their titles. The results are returned as a JSON response.
 */