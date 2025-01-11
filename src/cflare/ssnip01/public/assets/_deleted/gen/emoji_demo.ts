// npx ts-node twine_gen2.ts

const bob = "☕💎🎶👩‍🦳🗽🍞";

// Updated regex to handle multi-code-point emojis more accurately
const emojiRegex = /\p{Emoji}\p{Extended_Pictographic}*[\uFE0F\u200D\p{Emoji_Modifier}]*\p{Extended_Pictographic}*/gu;

// Extracting emojis using the regex
const emojis = bob.match(emojiRegex) || [];

// Printing each emoji on a new line
emojis.forEach(emoji => {
    console.log(emoji + "\n");
});
