async function requestGroq(env, prompt) {
    const apiKey = env.GROQ_API_KEY;

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

function makeStoryPromptGroq(lesson, emoji) {
    // Write a new story that ends in tragedy because the following life lesson is ignored: ${lesson}  
    return `
You are famous for your stories for young children in the style of Roald Dahl, Edward Gorey and Tim Burton.
Write a story that teaches the life lesson: ${lesson}
Do not explicitly say the lesson in words but teach it using scenes written to use a single emoji in this order: ${emoji} 
Put scene text inside <scene> </scene> tags. Start with a detailed plan inside <plan> </plan> tags. 
Use no other XML tags. Keep everything suitable and interesting for young children.
    `
  }

function makePicturePromptGroq(storySpec) {
    return `
Describe a single character or item that appears in each of the six STORY scenes below. 
List them in order one per scene. Do not output duplicates. 
Each description must be short and must NOT name people or items in the story only describe them. 
Use XML <picture> tag to wrap each description. Output six lines containing one description each.

STORY:
${storySpec}
    `
}

function makeQuestion1PromptGroq(storySpec) {
    return `
Suggest a thoughtful question about the STORY below. Output this question inside a <question> xml tag. 
Also output a brief answer to this question using an<answer> XML tag. 
Also create three other thoughtful same length responses that sound plausible but are incorrect. 
Wrap each of these responses in a <decoy> XML tag.

STORY:
${storySpec}
    `
}

function makeQuestion2PromptGroq(storySpec) {
    return `
Briefly explain the life lesson the STORY below teaches without making references to the story. 
Wrap this in an <answer> XML tag. Also create three other life lesson explanations that sound plausible but that this story DOES NOT teach. 
Wrap each of these in a <decoy> XML tag.

STORY:
${storySpec}
    `
}

export async function sendStoryRequest(env, lesson, emoji) {
    const prompt = makeStoryPromptGroq(lesson, emoji);
    return await requestGroq(env, prompt) + '</scene>';
}

export async function sendPicturesRequest(env, storySpec) {
    const prompt = makePicturePromptGroq(storySpec);
    return await requestGroq(env, prompt);
}

export async function sendQuestion1Request(env, storySpec) {
    const prompt = makeQuestion1PromptGroq(storySpec);
    console.log('making q1');
    return await requestGroq(env, prompt)  + '</decoy>';
}

export async function sendQuestion2Request(env, storySpec) {
    const prompt =  makeQuestion2PromptGroq(storySpec) ;
    console.log('making q2');
    const response = await requestGroq(env, prompt);
    return "<question> What life lesson does this story teach? </question>" + response + '</decoy>';
}