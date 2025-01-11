export function sceneTest(content) {
  let regex = /[\s\S]*?(<scene>[\s\S]{24,}?<\/scene>[\s\S]*?){6}/ism;
  return regex.test(content);
}

export function questionTest(content) {
  let regex = /<question>[\s\S]+?<\/question>[\s\S]*?<answer>[\s\S]+?<\/answer>[\s\S]*?(<decoy>[\s\S]+?<\/decoy>[\s\S]*?){3}/ism;
  return regex.test(content);
}

export function pictureTest(content) {
  let regex = /[\s\S]?(<picture>[\s\S]{16,}?<\/picture>[\s\S]?){6}/ism;
  return regex.test(content);
}


export function makeSceneArray(text) {
  const sceneRegex = /<scene>([\s\S]*?)<\/scene>/g;
  const scenes = [];
  let match;

  while ((match = sceneRegex.exec(text)) !== null) {
    scenes.push(match[1].trim());
  }

  return scenes;
}

export function makePictureArray(text) {
  const pictureRegex = /<picture>([\s\S]*?)<\/picture>/g;
  const pictures = [];
  let match;

  while ((match = pictureRegex.exec(text)) !== null) {
    pictures.push(match[1].trim());
  }

  return pictures;
}

export function makeQuestionDict(text) {
  const result = {
    question: '',
    answer: '',
    decoys: []
  };

  const questionMatch = text.match(/<question>([\s\S]*?)<\/question>/);
  if (questionMatch) {
    result.question = questionMatch[1].trim();
  }

  const answerMatch = text.match(/<answer>([\s\S]*?)<\/answer>/);
  if (answerMatch) {
    result.answer = answerMatch[1].trim();
  }

  const decoyRegex = /<decoy>([\s\S]*?)<\/decoy>/g;
  let decoyMatch;
  while ((decoyMatch = decoyRegex.exec(text)) !== null) {
    result.decoys.push(decoyMatch[1].trim());
  }

  return result;
}
