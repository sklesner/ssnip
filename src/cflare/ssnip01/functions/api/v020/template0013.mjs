

export function getLesson(ctx) {
  function getRandomLine(lines) {
    const lineArray = String(lines).split('\n').filter(line => line.trim() !== '');
    if (lineArray.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * lineArray.length);
    return lineArray[randomIndex];
  }
  
  // console.log("Lessons content:", lessons); // Debug log
  // const lessons = await loadTextFileAsync(env,'lesson.txt');
  const lessons = ctx.txtFileMap.get("lesson")
  return getRandomLine(lessons);
}


// TODO remove
export function makeTwineButton(ctx, buttonText, nextPageName) {
  return ctx.txtFileMap.get("twine_button")
    .replace(/<buttonText>/g, buttonText)
    .replace(/<nextPageName>/g, nextPageName)
    ;
}

export function makeTwineHeader(ctx, storyName) {
  return ctx.txtFileMap.get("twine_header")
    .replace(/<storyName>/g, storyName)
    ;
}

export function makeTwineScene(ctx, storyId, pid, pageName, prevPageName, nextPageName, sceneText, emoji) {
  return ctx.txtFileMap.get("twine_scene")
    .replace(/<storyId>/g,storyId)
    .replace(/<pid>/g, pid)
    .replace(/<pageName>/g, pageName)
    .replace(/<prevPageName>/g, prevPageName)
    .replace(/<nextPageName>/g, nextPageName)
    .replace(/<sceneText>/g, sceneText)
    .replace(/<emoji>/g, emoji)
    ;
}

export function makeTwineSceneUrl(ctx, storyId, pid, pageName, sceneText, bText, bAction, emoji) {
  return ctx.txtFileMap.get("twine_scene_url")
    .replace(/<storyId>/g,storyId)
    .replace(/<pid>/g, pid)
    .replace(/<pageName>/g, pageName)
    .replace(/<sceneText>/g, sceneText)
    .replace(/<bText>/g, bText)
    .replace(/<bAction>/g, bAction)
    .replace(/<emoji>/g, emoji)
    ;
}

export function makeTwineFooter(ctx, storyName) {
  return ctx.txtFileMap.get("twine_footer")
  .replace(/<storyName>/g, storyName)
  ;
}

export function makeTwineQuestion(ctx, storyId, pid, picId, emoji, pageName, questionText,
  b1Text, b1Logic,
  b2Text, b2Logic,
  b3Text, b3Logic,
  b4Text, b4Logic,
  prevPageName, nextPageName
) {
  return ctx.txtFileMap.get("twine_question")
  .replace(/<storyId>/g, storyId)
  .replace(/<pid>/g, pid)
  .replace(/<picId>/g, picId)
  .replace(/<emoji>/g, emoji)
  .replace(/<pageName>/g, pageName)
  .replace(/<questionText>/g, questionText)
  
  .replace(/<b1Text>/g, b1Text)
  .replace(/<b1Logic>/g, b1Logic)
  
  .replace(/<b2Text>/g, b2Text)
  .replace(/<b2Logic>/g, b2Logic)

  .replace(/<b3Text>/g, b3Text)
  .replace(/<b3Logic>/g, b3Logic)

  .replace(/<b4Text>/g, b4Text)
  .replace(/<b4Logic>/g, b4Logic)

  .replace(/<prevPageName>/g, prevPageName)
  .replace(/<nextPageName>/g, nextPageName)
  ;
}


export function makeCorrectButtonLogic(ctx, nextPage) {
  return ctx.txtFileMap.get("correct_button_logic")
  .replace(/<nextPage>/g, nextPage)
}

export function makeIncorrectButtonLogic(ctx, nextPage) {
  return ctx.txtFileMap.get("incorrect_button_logic")
  .replace(/<nextPage>/g, nextPage)
}

export function makeTwineResponseScene(ctx, pid, pageName, messageText, bText, bAction){
  return ctx.txtFileMap.get("twine_response_scene")
  .replace(/<pid>/g, pid)
  .replace(/<pageName>/g, pageName)
  .replace(/<messageText>/g, messageText)
  .replace(/<bText>/g, bText)
  .replace(/<bAction>/g, bAction)
}

export function makeTwineResponseUrl(ctx, pid, pageName, messageText, bText, bAction){
  return ctx.txtFileMap.get("twine_response_url")
  .replace(/<pid>/g, pid)
  .replace(/<pageName>/g, pageName)
  .replace(/<messageText>/g, messageText)
  .replace(/<bText>/g, bText)
  .replace(/<bAction>/g, bAction)
}


export function makeTwine(ctx,storyId,storyName,storySpec,emojiDelimited){
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const question1 = storySpec.scene_array[0].scene_question;
  const incorrectLogic1 = makeIncorrectButtonLogic(ctx, "Q1")
  const options1 = shuffleArray([
    {text: storySpec.scene_array[0].correct_answer, logic: makeCorrectButtonLogic(ctx,"Q2")},
    ...storySpec.scene_array[0].decoy_answer_array.map(decoy => ({text: decoy, logic: incorrectLogic1}))
  ]);

  const question2 = storySpec.scene_array[1].scene_question;
  const incorrectLogic2 = makeIncorrectButtonLogic(ctx, "Q2")
  const options2 = shuffleArray([
    {text: storySpec.scene_array[1].correct_answer, logic: makeCorrectButtonLogic(ctx,"Q3")},
    ...storySpec.scene_array[1].decoy_answer_array.map(decoy => ({text: decoy, logic: incorrectLogic2}))
  ]);

  const question3 = storySpec.scene_array[2].scene_question;
  const incorrectLogic3 = makeIncorrectButtonLogic(ctx, "Q3")
  const options3 = shuffleArray([
    {text: storySpec.scene_array[2].correct_answer, logic: makeCorrectButtonLogic(ctx,"Q4")},
    ...storySpec.scene_array[2].decoy_answer_array.map(decoy => ({text: decoy, logic: incorrectLogic3}))
  ]);

  const question4 = storySpec.scene_array[3].scene_question;
  const incorrectLogic4 = makeIncorrectButtonLogic(ctx, "Q4")
  const options4 = shuffleArray([
    {text: storySpec.scene_array[3].correct_answer, logic: makeCorrectButtonLogic(ctx,"Q5")},
    ...storySpec.scene_array[3].decoy_answer_array.map(decoy => ({text: decoy, logic: incorrectLogic4}))
  ]);

  const question5 = storySpec.scene_array[4].scene_question;
  const incorrectLogic5 = makeIncorrectButtonLogic(ctx, "Q5")
  const options5 = shuffleArray([
    {text: storySpec.scene_array[4].correct_answer, logic: makeCorrectButtonLogic(ctx,"Q6")},
    ...storySpec.scene_array[4].decoy_answer_array.map(decoy => ({text: decoy, logic: incorrectLogic5}))
  ]);

  const question6 = storySpec.scene_array[5].scene_question;
  const incorrectLogic6 = makeIncorrectButtonLogic(ctx, "Q6")
  const options6 = shuffleArray([
    {text: storySpec.scene_array[5].correct_answer, logic: makeCorrectButtonLogic(ctx,"F")},
    ...storySpec.scene_array[5].decoy_answer_array.map(decoy => ({text: decoy, logic: incorrectLogic6}))
  ]);

  const sceneArray = storySpec.scene_array;

  const emojiArray = emojiDelimited.split('-'); 

  return makeTwineHeader(ctx, storyName)
    + makeTwineScene(ctx, storyId, "2", "2", "1", "3", sceneArray[0].scene_story, emojiArray[0])
    + makeTwineScene(ctx, storyId, "3", "3", "2", "4", sceneArray[1].scene_story, emojiArray[1])
    + makeTwineScene(ctx, storyId, "4", "4", "3", "5", sceneArray[2].scene_story, emojiArray[2])
    + makeTwineScene(ctx, storyId, "5", "5", "4", "6", sceneArray[3].scene_story, emojiArray[3])
    + makeTwineScene(ctx, storyId, "6", "6", "5", "7", sceneArray[4].scene_story, emojiArray[4])
    + makeTwineScene(ctx, storyId, "7", "7", "6", "Q1", sceneArray[5].scene_story, emojiArray[5])
    + makeTwineQuestion(ctx, storyId,  8, 2, emojiArray[0], "Q1", question1, options1[0].text, options1[0].logic, options1[1].text, options1[1].logic, options1[2].text, options1[2].logic, options1[3].text, options1[3].logic, "7", "Q2")
    + makeTwineQuestion(ctx, storyId,  9, 3, emojiArray[1], "Q2", question2, options2[0].text, options2[0].logic, options2[1].text, options2[1].logic, options2[2].text, options2[2].logic, options2[3].text, options2[3].logic, "Q1", "Q3")
    + makeTwineQuestion(ctx, storyId, 10, 4, emojiArray[2], "Q3", question3, options3[0].text, options3[0].logic, options3[1].text, options3[1].logic, options3[2].text, options3[2].logic, options3[3].text, options3[3].logic, "Q2", "Q4")
    + makeTwineQuestion(ctx, storyId, 11, 5, emojiArray[3], "Q4", question4, options4[0].text, options4[0].logic, options4[1].text, options4[1].logic, options4[2].text, options4[2].logic, options4[3].text, options4[3].logic, "Q3", "Q5")
    + makeTwineQuestion(ctx, storyId, 12, 6, emojiArray[4], "Q5", question5, options5[0].text, options5[0].logic, options5[1].text, options5[1].logic, options5[2].text, options5[2].logic, options5[3].text, options5[3].logic, "Q4", "Q6")
    + makeTwineQuestion(ctx, storyId, 13, 7, emojiArray[5], "Q6", question6, options6[0].text, options6[0].logic, options6[1].text, options6[1].logic, options6[2].text, options6[2].logic, options6[3].text, options6[3].logic, "Q5", "F")
    + makeTwineResponseUrl(ctx, 14, "F", "Story complete!\nQuiz score: $correctCount ✔️ and $incorrectCount ❌", "Another story?", "https://joe.ackop.com/")
    + makeTwineFooter(ctx, storyName);
}