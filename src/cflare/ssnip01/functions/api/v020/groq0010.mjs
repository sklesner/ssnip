export async function sendRequest(ctx, prompt) {
    const apiKey = ctx.env.GROQ_API_KEY;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    // content: "You are Roald Dahl known for creating incredible worlds and showing young readers the power of language."
                    content: "You are an AI assistant that helps people with their questions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-70b-versatile",
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            stream: false,
            stop: null
        })
    });

    if (!groqResponse.ok) {
        throw new Error('Failed to get response from Groq');
    }

    const responseData = await groqResponse.json();
    return responseData.choices[0].message.content;
}
