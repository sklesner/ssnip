export async function sendRequest(ctx, prompt) {
    
    const apiKey = ctx.env.OPENAI_API_KEY;

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            },
        body: JSON.stringify({
            model: 'gpt-4o',
            // model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt}],
            // Write a short five scene story for young children in the style or Roald Dahl about the life lesson "${lesson}" Do not repeat the lesson words verbatim.  Change the words to be suitable for children. Tell a story that has tragic ending because this life lesson was ignored. Tell the story using dialogue between the characters. Do not use XML except put each different scene in it's own XML<scene> tag.
        }),
    });

    if (!openAiResponse.ok) {
        throw new Error('Failed to get response from OpenAI');
    }

    const responseData = await openAiResponse.json();
    return responseData.choices[0].message.content;
}
