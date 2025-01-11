
async function makeHash(text) {
    const crypto = globalThis.crypto;

    function bufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
    }

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return bufferToHex(hashBuffer);
    }

    let sha256Hash = await sha256(text);
    return sha256Hash.slice(0, 6);
}

function sceneTest(content) {
    let regex = /[\s\S]*?(<scene>[\s\S]{24,}?<\/scene>[\s\S]*?){6}/ism;
    return regex.test(content);
}

async function requestGPT(env, lesson, emoji) {
    
    const apiKey = env.OPENAI_API_KEY;
    
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `You are Roald Dahl a famous children's author. Write a short story that ends in tragedy because the following life lesson is ignored: ${lesson}. Do not mention the lesson it teaches just tell the story using scenes of dialogue written to be illustrated by a single emoji in this order: ${emoji} Put each scene inside <scene> </scene> tags. Start with a short story plan inside <plan> </plan> tags. Use no other XML tags. Keep everything short and suitable and interesting for young children.` }],
      }),
    });
  
    if (!openAiResponse.ok) {
      throw new Error('Failed to get response from OpenAI');
    }
  
    const responseData = await openAiResponse.json();
    return responseData.choices[0].message.content;
}
  

async function requestGroq(env, lesson, emoji) {
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
            content: "You are Roald Dahl known for creating incredible worlds and showing young readers the power of language."
            },
            {
            role: "user",
            content: `Write a completely new short story that ends in tragedy because the following life lesson is ignored: ${lesson}.  Do not explicitly say the lesson in words but teach it using scenes of dialogue written to use a single emoji in this order: ${emoji} Put scene text inside <scene> </scene> tags. Start with a detailed plan inside <plan> </plan> tags. Use no other XML tags. Keep everything suitable and interesting for young children.`
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
    return responseData.choices[0].message.content + '</scene>';
}


async function makeStory(env, lesson, emoji) {
    let answer;
    for (let i = 0; i < 4; i++) {
        if (i > 0) console.log('try: ' + (i - 1));
        
        // answer = await requestGPT(env, lesson, emoji);
        answer = await requestGroq(env, lesson, emoji);
        
        if (sceneTest(answer)) break;
    }

    if (!sceneTest(answer)) {
        throw new Error('Failed to generate a valid response after multiple attempts');
    }

    return answer;
}

export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);

    const emoji = url.searchParams.get('e') || "☕💎🎶👩🗽🍞";
    const lesson = url.searchParams.get('l') || "Make sure your habits align with your desired identity"

    try {
        const answer = await makeStory(env, lesson, emoji);

        const id = await makeHash(answer)
        const filename = id + '_' + emoji + '.txt';

        await env.STORY_BUCKET.put(filename, answer, {
            httpMetadata: {
                contentType: 'text/plain',
            },
        });

        return new Response(JSON.stringify({ answer }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}