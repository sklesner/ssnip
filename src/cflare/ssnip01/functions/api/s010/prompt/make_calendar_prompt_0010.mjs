export function make_calendar_prompt(startDate) {
    return `
Write a story for children in the style of Roald Dahl that warns them about "${lesson}" 
Write the story to have exactly one scene for each emoji here: ${emoji} 
Before you start output a story plan and explain how your story plot will make the warning understandable to children.

Your output must follow the JSON EXAMPLE below. 
The "story_plan" is where you plan out the story.
The scene_array contains the six scenes. 
For each scene:
    "scene_emoji" is the emoji for that scene.
    "scene_story" is the story for that scene.
    "scene_picture" describes a single character or item that appears in that scene.  Each description must be short and must NOT name people or items in the story only describe them. Do not output duplicates. 
    "scene_question" is a thoughtful question to ask a child about that scene. 
    "correct_answer" is the correct answer to the question
    "decoy_response_array" contains three thoughtful question responses that sound plausible but are incorrect but are as long as correct_answer

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
