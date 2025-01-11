async function requestGPT(env, prompt) {
    
    const apiKey = env.OPENAI_API_KEY;

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

function makeStoryPromptGPT(lesson, emoji) {
    // Write a new story that ends in tragedy because the following life lesson is ignored: ${lesson}  
    return `
You are famous for your stories for young children in the style of Roald Dahl, Edward Gorey and Tim Burton.
Write a story that teaches the life lesson: ${lesson}
Do not explicitly say the lesson in words but teach it using scenes written to use a single emoji in this order: ${emoji} 
Put scene text inside <scene> </scene> tags. Start with a detailed plan inside <plan> </plan> tags. 
Use no other XML tags. Keep everything suitable and interesting for young children.
`
  }

function makePicturePromptGPT(storySpec) {
    return `
Describe a single character or item that appears in each of the six STORY scenes below. 
List them in order one per scene. Do not output duplicates. 
Each description must be short and must NOT name people or items in the story only describe them. 
Use XML <picture> tag to wrap each description. Output six lines containing one description each.

STORY:
${storySpec}
    `
}

function makeQuestion1PromptGPT(storySpec) {
    return `
Suggest a thoughtful question about the STORY below. Output this question inside a <question> xml tag. 
Also output a brief answer to this question using an<answer> XML tag. 
Also create three other thoughtful same length responses that sound plausible but are incorrect. 
Wrap each of these responses in a <decoy> XML tag.

STORY:
${storySpec}
    `
}

function makeQuestion2PromptGPT(storySpec) {
    return `
Briefly explain the life lesson the STORY below teaches without making references to the story. 
Wrap this in an <answer> XML tag. Also create three other life lesson explanations that sound plausible but that this story DOES NOT teach. 
Wrap each of these in a <decoy> XML tag.

STORY:
${storySpec}
    `
}

export async function sendStoryRequest(env, lesson, emoji) {
    const prompt = makeStoryPromptGPT(lesson, emoji);
    return await requestGPT(env, prompt);
}


export async function sendPicturesRequest(env, storySpec) {
    const prompt = makePicturePromptGPT(storySpec);
    return await requestGPT(env, prompt);
}


export async function sendQuestion1Request(env, storySpec) {
    const prompt = makeQuestion1PromptGPT(storySpec);
    console.log('making q1');
    return await requestGPT(env, prompt) + '</decoy>';
}

export async function sendQuestion2Request(env, storySpec) {
    const prompt = makeQuestion2PromptGPT(storySpec) ;
    console.log('making q2');
    const response = await requestGPT(env, prompt);
    return "<question> What life lesson does this story teach? </question>" + response + '</decoy>';
}