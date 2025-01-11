export function makeStorySpecPrompt(ctx) {
    ctx.story_lesson = getRandomLine(ctx.txtFileMap.get("story_lesson"));
    ctx.story_style = ctx.txtFileMap.get("story_style");

    // console.log("story_style:", ctx.story_style);
    // console.log("story_lesson:", ctx.story_lesson);
    
    return ctx.txtFileMap.get("story_prompt")
        .replace(/{six_emoji}/g, ctx.sixEmoji)
        .replace(/{first_emoji}/g, ctx.emojiArray[0])
        .replace(/{story_lesson}/g, ctx.story_lesson)
        .replace(/{story_style}/g, ctx.story_style)
    ;
}


function getRandomLine(lines) {
    const lineArray = String(lines).split('\n').filter(line => line.trim() !== '');
    if (lineArray.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * lineArray.length);
    return lineArray[randomIndex];
}