export function jsonToStorySpec(text) {
  try {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}') + 1;
    
    if (startIndex === -1 || endIndex === 0) {
      throw new Error("No JSON object found in the text");
    }
    
    const jsonString = text.slice(startIndex, endIndex);
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

//  XPATH: count(scene[picture and question and answer and count(decoy)=3])=6

// export function storyTest(content) {
//   // Regular expression to match a scene with required elements
//   const sceneRegex = /<scene>(?=.*?<picture>.*?<\/picture>)(?=.*?<question>.*?<\/question>)(?=.*?<answer>.*?<\/answer>)(?:(?!<scene>).)*?<\/scene>/gs;

//   // Regular expression to match decoy elements within a scene
//   const decoyRegex = /<decoy>.*?<\/decoy>/gs;

//   // Find all scenes that match the criteria
//   const validScenes = content.match(sceneRegex) || [];

//   // Count scenes with exactly 3 decoys
//   const scenesWithThreeDecoys = validScenes.filter(scene => {
//     const decoyCount = (scene.match(decoyRegex) || []).length;
//     return decoyCount === 3;
//   });

//   // Check if there are exactly 6 valid scenes
//   return scenesWithThreeDecoys.length === 6;
// }

// export function sceneTest(content) {
//   let regex = /[\s\S]*?(<scene>[\s\S]{24,}?<\/scene>[\s\S]*?){6}/ism;
//   return regex.test(content);
// }

// export function questionTest(content) {
//   let regex = /<question>[\s\S]+?<\/question>[\s\S]*?<answer>[\s\S]+?<\/answer>[\s\S]*?(<decoy>[\s\S]+?<\/decoy>[\s\S]*?){3}/ism;
//   return regex.test(content);
// }

// export function pictureTest(content) {
//   let regex = /[\s\S]?(<picture>[\s\S]{16,}?<\/picture>[\s\S]?){6}/ism;
//   return regex.test(content);
// }


// export function makeSceneArray(text) {
//   const sceneRegex = /<scene>([\s\S]*?)<\/scene>/g;
//   const scenes = [];
//   let match;

//   while ((match = sceneRegex.exec(text)) !== null) {
//     scenes.push(match[1].trim());
//   }

//   return scenes;
// }

// export function makeStoryDict(content) {
//   const result = {
//     scenes: [],
//     questions: [],
//     pictures: []
//   };

//   const sceneRegex = /<scene>([\s\S]*?)<\/scene>/g;
//   let sceneMatch;

//   while ((sceneMatch = sceneRegex.exec(content)) !== null) {
//     const sceneContent = sceneMatch[1].trim();
//     result.scenes.push(sceneContent);

//     const questionDict = {
//       question: '',
//       answer: '',
//       decoys: []
//     };

//     const questionMatch = sceneContent.match(/<question>([\s\S]*?)<\/question>/);
//     if (questionMatch) {
//       questionDict.question = questionMatch[1].trim();
//     }

//     const answerMatch = sceneContent.match(/<answer>([\s\S]*?)<\/answer>/);
//     if (answerMatch) {
//       questionDict.answer = answerMatch[1].trim();
//     }

//     const decoyRegex = /<decoy>([\s\S]*?)<\/decoy>/g;
//     let decoyMatch;
//     while ((decoyMatch = decoyRegex.exec(sceneContent)) !== null) {
//       questionDict.decoys.push(decoyMatch[1].trim());
//     }

//     result.questions.push(questionDict);

//     const pictureMatch = sceneContent.match(/<picture>([\s\S]*?)<\/picture>/);
//     if (pictureMatch) {
//       result.pictures.push(pictureMatch[1].trim());
//     }
//   }

//   return result;
// }

// export function makePictureArray(text) {
//   const pictureRegex = /<picture>([\s\S]*?)<\/picture>/g;
//   const pictures = [];
//   let match;

//   while ((match = pictureRegex.exec(text)) !== null) {
//     pictures.push(match[1].trim());
//   }

//   return pictures;
// }

// export function makeQuestionDict(text) {
//   const result = {
//     question: '',
//     answer: '',
//     decoys: []
//   };

//   const questionMatch = text.match(/<question>([\s\S]*?)<\/question>/);
//   if (questionMatch) {
//     result.question = questionMatch[1].trim();
//   }

//   const answerMatch = text.match(/<answer>([\s\S]*?)<\/answer>/);
//   if (answerMatch) {
//     result.answer = answerMatch[1].trim();
//   }

//   const decoyRegex = /<decoy>([\s\S]*?)<\/decoy>/g;
//   let decoyMatch;
//   while ((decoyMatch = decoyRegex.exec(text)) !== null) {
//     result.decoys.push(decoyMatch[1].trim());
//   }

//   return result;
// }

