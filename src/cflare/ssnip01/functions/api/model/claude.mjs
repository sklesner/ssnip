async function requestClaude(env, prompt) {
    const apiKey = env.CLAUDE_API_KEY;

    try {
        const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
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
            })
        });

        if (!claudeResponse.ok) {
            const errorBody = await claudeResponse.text();
            throw new Error(`Failed to get response from Claude: ${claudeResponse.status} ${claudeResponse.statusText}. Error body: ${errorBody}`);
        }

        const responseData = await claudeResponse.json();
        return responseData.content[0].text;
    } catch (error) {
        console.error("Error in requestClaude:", error);
        throw error;
    }
}

function makeStoryPromptClaude(lesson, emoji) {
// Write a new story that ends in tragedy because the following life lesson is ignored: ${lesson}  
// Do not explicitly say the lesson in words but teach it using scenes of dialogue written to use a single emoji in this order: ${emoji}
    return `
You are famous for your stories for young children in the style of Roald Dahl, Edward Gorey and Tim Burton.
Write a story that teaches the life lesson: ${lesson}
Do not explicitly say the lesson in words but teach it using scenes written to use a single emoji in this order: ${emoji}
Put scene text inside <scene> </scene> tags. Start with a detailed plan inside <plan> </plan> tags. 
Use no other XML tags. Keep everything suitable and interesting for young children.
    `
  }

function makePicturePromptClaude(storySpec) {
    return `
Describe a single character or item that appears in each of the six STORY scenes below. 
List them in order one per scene. Do not output duplicates. 
Each description must be short and must NOT name people or items in the story only describe them. 
Use XML <picture> tag to wrap each description. Output six lines containing one description each.

STORY:
${storySpec}
    `
}

function makeQuestion1PromptClaude(storySpec) {
    return `
Suggest a thoughtful question about the STORY below. Output this question inside a <question> xml tag. 
Also output a brief answer to this question using an<answer> XML tag. 
Also create three other thoughtful same length responses that sound plausible but are incorrect. 
Wrap each of these responses in a <decoy> XML tag.

STORY:
${storySpec}
    `
}

function makeQuestion2PromptClaude(storySpec) {
    return `
Briefly explain the life lesson the STORY below teaches without making references to the story. 
Wrap this in an <answer> XML tag. Also create three other life lesson explanations that sound plausible but that this story DOES NOT teach. 
Wrap each of these in a <decoy> XML tag.

STORY:
${storySpec}
    `
}

export async function sendStoryRequest(env, lesson, emoji) {
    const prompt = makeStoryPromptClaude(lesson, emoji);
    return await requestClaude(env, prompt) + '</scene>';
}

export async function sendPicturesRequest(env, storySpec) {
    const prompt = makePicturePromptClaude(storySpec);
    return await requestClaude(env, prompt);
}

export async function sendQuestion1Request(env, storySpec) {
    const prompt = makeQuestion1PromptClaude(storySpec);
    console.log('making q1');
    return await requestClaude(env, prompt)  + '</decoy>';
}

export async function sendQuestion2Request(env, storySpec) {
    const prompt =  makeQuestion2PromptClaude(storySpec) ;
    console.log('making q2');
    const response = await requestClaude(env, prompt);
    return "<question> What life lesson does this story teach? </question>" + response + '</decoy>';
}