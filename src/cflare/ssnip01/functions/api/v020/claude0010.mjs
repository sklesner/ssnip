export async function sendRequest(ctx, prompt) {
    const apiKey = ctx.env.CLAUDE_API_KEY;

    const body = JSON.stringify({
        // model: "claude-3-haiku-20240307",
        // max_tokens: 2048,
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4096,
        temperature: 1,
        // system: "You are Roald Dahl known for creating incredible worlds and showing young readers the power of language.",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    console.log("claude body: " + body);

    try {
        const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            body: body
        });

        if (!claudeResponse.ok) {
            const errorBody = await claudeResponse.text();
            throw new Error(`Failed to get response from Claude: ${claudeResponse.status} ${claudeResponse.statusText}. Error body: ${errorBody}`);
        }

        const responseData = await claudeResponse.json();
        rtext = await responseData.content[0].text;
        console.log("claude rtext: " + rtext);
        return rtext;
    } catch (error) {
        console.error("Error in requestClaude:", error);
        throw error;
    }
}