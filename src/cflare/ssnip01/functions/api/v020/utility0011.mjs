export async function makeGeneratingHtml(env,emojiDelimited) {
  const templateP = await env.ASSETS.fetch('https://joe.ackop.com/assets/generating_0015.html');
  const template = await templateP.text();
  return await template
      .replace(/<emojiTxt>/g,emojiDelimited)
    ;
}

// export async function makeGeneratingHtml2(env,emojiDelimited,storyId) {
//   const templateP = await env.ASSETS.fetch('https://joe.ackop.com/assets/generating_0015.html');
//   const template = await templateP.text();
//   return await template
//     .replace(/<storyId>/g,storyId)
//     .replace(/<emojiTxt>/g,emojiDelimited)
//   ;
// }

export async function makeHash(text) {
  const crypto = globalThis.crypto;

  function bufferToHex(buffer) {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2,'0'))
        .join('');
  }

  async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256',msgBuffer);
      return bufferToHex(hashBuffer);
  }

  let sha256Hash = await sha256(text);
  return sha256Hash.slice(0,6);
}


export async function loadStoryTxtAsync(env,filePath) {
  // try {
    // return await fs.readFile(filePath,'utf8');
    var stuff = await env.ASSETS.fetch('https://joe.ackop.com/assets/story/'+ filePath + '.txt');
    return await stuff.text();
  // } catch (error) {
  //   console.error(`Error reading file from ${filePath}:`,error);
  //   return '';
  // }
}

export async function loadStyleAsync(env,filePath) {
  const STYLE_COUNT=30;
  const randomIndex = Math.floor(Math.random() * STYLE_COUNT)+1;
  // try {
    // return await fs.readFile(filePath,'utf8');
    var stuff = await env.ASSETS.fetch('https://joe.ackop.com/assets/story/style'+ randomIndex + '.txt');
    return await stuff.text();
  // } catch (error) {
  //   console.error(`Error reading file from ${filePath}:`,error);
  //   return '';
  // }
}


export async function loadTextFileAsync(env,filePath) {
  // try {
    // return await fs.readFile(filePath,'utf8');

    var stuff = await env.ASSETS.fetch('https://joe.ackop.com/assets/txtFileMap/'+ filePath + '.txt');
    return await stuff.text();
  // } catch (error) {
  //   console.error(`Error reading file from ${filePath}:`,error);
  //   return '';
  // }
}

export async function loadTxtFiles(env) {
  const txtFileMap = new Map();
  
  const [
    twine_header,
    twine_scene,
    twine_scene_url,
    twine_footer,

    twine_question,
    twine_response_scene,
    twine_response_url,
    lesson,

    sample_input,
    sample_pictureSpec,
    sample_q1,
    sample_q2,

    sample_story_spec,
    correct_button_logic,
    incorrect_button_logic
  ] = await Promise.all([
    loadTextFileAsync(env,"twine_header0013"),
    loadTextFileAsync(env,"twine_scene_0012.ptwee"),
    loadTextFileAsync(env,"twine_scene_url"),
    loadTextFileAsync(env,"twine_footer"),
  
    loadTextFileAsync(env,"twine_question_0006.ptwee"),
    loadTextFileAsync(env,"twine_response_scene"),
    loadTextFileAsync(env,"twine_response_url"),
    loadTextFileAsync(env,"lesson2"),

    loadTextFileAsync(env,"sample_input"),
    loadTextFileAsync(env,"sample_pictureSpec"),
    loadTextFileAsync(env,"sample_q1"),
    loadTextFileAsync(env,"sample_q2"),

    loadTextFileAsync(env,"sample_story_spec"),
    loadTextFileAsync(env,"correct_button_logic"),
    loadTextFileAsync(env,"incorrect_button_logic"),
  ]);

  txtFileMap.set("twine_header",twine_header);
  txtFileMap.set("twine_scene",twine_scene);
  txtFileMap.set("twine_scene_url",twine_scene_url);
  txtFileMap.set("twine_footer",twine_footer);

  txtFileMap.set("twine_question",twine_question);
  txtFileMap.set("twine_response_scene",twine_response_scene);
  txtFileMap.set("twine_response_url",twine_response_url);
  txtFileMap.set("lesson",lesson);

  txtFileMap.set("sample_input",sample_input);
  txtFileMap.set("sample_pictureSpec",sample_pictureSpec);
  txtFileMap.set("sample_q1",sample_q1);
  txtFileMap.set("sample_q2",sample_q2);

  txtFileMap.set("sample_story_spec",sample_story_spec);
  txtFileMap.set("correct_button_logic",correct_button_logic);
  txtFileMap.set("incorrect_button_logic",incorrect_button_logic);

  return txtFileMap;
}

