export function jsonToStorySpec(cText) {
    const sText = cText.replace(/chapter/g,'scene');
    try {
        const startIndex = sText.indexOf('{');
        const endIndex = sText.lastIndexOf('}') + 1;

        if (startIndex === -1 || endIndex === 0) {
            throw new Error("No JSON object found in the text");
        }

        const jsonString = sText.slice(startIndex, endIndex);
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
    } catch (error) {
        console.error("Error extracting or parsing JSON:", error);
        return null;
    }
}

export function storySpecTest(jsonObj) {
  if (!jsonObj.hasOwnProperty('story_prompt') || typeof jsonObj.story_prompt !== 'string') {
      return false;
  }

  if (!jsonObj.hasOwnProperty('scene_array') || !Array.isArray(jsonObj.scene_array)) {
      return false;
  }

  if (jsonObj.scene_array.length !== 6) {
      return false;
  }

  for (let scene of jsonObj.scene_array) {
      if (!scene.hasOwnProperty('scene_emoji') || typeof scene.scene_emoji !== 'string') {
          return false;
      }

      if (!scene.hasOwnProperty('scene_story') || typeof scene.scene_story !== 'string') {
          return false;
      }

      if (!scene.hasOwnProperty('scene_picture') || typeof scene.scene_picture !== 'string') {
          return false;
      }

      if (!scene.hasOwnProperty('scene_question') || typeof scene.scene_question !== 'string') {
          return false;
      }

      if (!scene.hasOwnProperty('correct_answer') || typeof scene.correct_answer !== 'string') {
          return false;
      }

      if (!scene.hasOwnProperty('decoy_answer_array') || !Array.isArray(scene.decoy_answer_array)) {
          return false;
      }

      if (scene.decoy_answer_array.length !== 3 || !scene.decoy_answer_array.every(answer => typeof answer === 'string')) {
          return false;
      }
  }

  return true;
}
