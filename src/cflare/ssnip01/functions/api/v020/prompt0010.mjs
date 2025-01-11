export function makeStorySpecPrompt(lesson, emoji, emojiArray) {
    return `
    You are famous for your stories for young children in the style of Roald Dahl, Edward Gorey and Tim Burton.
    Write a story that teaches the following life lesson: "${lesson}"
    Do not explicitly say the lesson in words but teach it using scenes written to use a single emoji in this order: ${emoji}
    Your output must follow the JSON EXAMPLE below. The story_plan is where you plan out the story.
    The scene_array contains the six scenes. For each scene:
    "scene_emoji" is the emoji for that scene.
    "scene_story" is the story for that scene.
    "scene_picture" describes a single character or item that appears in that scene.  Each description must be short and must NOT name people or items in the story only describe them. Do not output duplicates. 
    "scene_question" is a thoughtful question to ask a child about that scene. 
    "correct_answer" is the correct answer to the question
    "decoy_response_array" contains three thoughtful question responses that sound plausible but are incorrect. 
    Important output only valid JSON per the example below.
    
    JSON EXAMPLE:
    
    {
        "story_prompt":"${emoji}",
        "story_plan":"plan your story here",
        "scene_array": [  
            {
                "scene_emoji":"${emojiArray[0]}",
                "scene_story": "...",
                "scene_picture": "...",
                "scene_question": "...",
                "correct_answer": "...",
                "decoy_answer_array": [
                    "...",
                    "...",
                    "..."
                ]
            },
            // repeat 5 more times one per emoji
        ]
    }    
`
  }

export function makeStoryPrompt2(lesson, emoji) {
    return `
You are famous for your stories for young children in the style of Roald Dahl, Edward Gorey and Tim Burton.
Write a story that teaches the life lesson: ${lesson}
Do not explicitly say the lesson in words but teach it using scenes written to use a single emoji in this order: ${emoji}
Put scene text inside <scene> </scene> tags. Start with a detailed plan inside <plan> </plan> tags.
Inside each <scene> suggest one thoughtful question about that scene. Output this question inside a <question> xml tag. Also output a brief answer to this question using an <answer> XML tag. Also create three other thoughtful responses that sound plausible but are incorrect. Wrap each of these responses in a <decoy> XML tag.

Inside each <scene>  describe a single character or item that appears in that scene.  Each description must be short and must NOT name people or items in the story only describe them. Do not output duplicates. Output this description inside a <picture> xml tag.

Use no other XML tags. Keep everything suitable and interesting for children.
`;
}

export function makeStoryPrompt(lesson, emoji) {
    // Write a new story that ends in tragedy because the following life lesson is ignored: ${lesson}  
    return `
You are famous for your stories for young children in the style of Roald Dahl, Edward Gorey and Tim Burton.
Write a story that teaches the life lesson: ${lesson}
Do not explicitly say the lesson in words but teach it using scenes written to use a single emoji in this order: ${emoji} 
Put scene text inside <scene> </scene> tags. Start with a detailed plan inside <plan> </plan> tags. 
Use no other XML tags. Keep everything suitable and interesting for young children.
`;
}

export function makePicturePrompt(storySpec) {
    return `
Describe a single character or item that appears in each of the six STORY scenes below. 
List them in order one per scene. Do not output duplicates. 
Each description must be short and must NOT name people or items in the story only describe them. 
Use XML <picture> tag to wrap each description. Output six lines containing one description each.

STORY:
${storySpec}
    `;
}

export function makeQuestion1Prompt(storySpec) {
    return `
Suggest a thoughtful question about the STORY below. Output this question inside a <question> xml tag. 
Also output a brief answer to this question using an<answer> XML tag. 
Also create three other thoughtful same length responses that sound plausible but are incorrect. 
Wrap each of these responses in a <decoy> XML tag.

STORY:
${storySpec}
    `;
}

export function makeQuestion2Prompt(storySpec) {
    return `
Briefly explain the life lesson the STORY below teaches without making references to the story. 
Wrap this in an <answer> XML tag. Also create three other life lesson explanations that sound plausible but that this story DOES NOT teach. 
Wrap each of these in a <decoy> XML tag.

STORY:
${storySpec}
    `;
}


