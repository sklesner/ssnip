// export async function makeGeneratingHtml(env,emojiDelimited) {
//   const templateP = await env.ASSETS.fetch('https://joe.ackop.com/assets/generating_0015.html');
//   const template = await templateP.text();
//   return await template
//       .replace(/<emojiTxt>/g,emojiDelimited)
//     ;
// }

export function makeGeneratingHtml(ctx) {
  return ctx.txtFileMap.get("generating_html")
      .replace(/<emojiTxt>/g,ctx.emojiDelimited);
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

export async function loadAssetAsync(env,filePath) {
  // try {
    // return await fs.readFile(filePath,'utf8');

    var stuff = await env.ASSETS.fetch('https://joe.ackop.com/assets/'+ filePath);
    return await stuff.text();
  // } catch (error) {
  //   console.error(`Error reading file from ${filePath}:`,error);
  //   return '';
  // }
}

export async function loadTxtFileMapAsync(env,filePath) {
  return loadAssetAsync(env,'txtFileMap/'+ filePath + '.txt')
}

export async function loadStoryTxtAsync(env,filePath) {
  return loadAssetAsync(env,'story/'+ filePath + '.txt')
}

export async function loadStyleTxtAsync(env) {
  const STYLE_COUNT=30; // TODO make dynamic
  const randomIndex=1+Math.floor(Math.random() * STYLE_COUNT);
  return loadAssetAsync(env,'story/style/style'+ randomIndex + '.txt')
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
    // lesson,

    // sample_input,
    // sample_pictureSpec,
    // sample_q1,
    // sample_q2,

    sample_story_spec,
    correct_button_logic,
    incorrect_button_logic,

    story_lesson,
    story_prompt,
    story_style,

    generating_html
  ] = await Promise.all([
    // loadTxtFileMapAsync(env,"twine_header0013"),
    loadTxtFileMapAsync(env,"twine_header0015"),

    loadTxtFileMapAsync(env,"twine_scene_0016.ptwee"),
    loadTxtFileMapAsync(env,"twine_scene_url"),
    loadTxtFileMapAsync(env,"twine_footer"),
  
    loadTxtFileMapAsync(env,"twine_question_0009.ptwee"),
    loadTxtFileMapAsync(env,"twine_response_scene"),
    loadTxtFileMapAsync(env,"twine_response_url_0013.ptwee"),
    // loadTextFileAsync(env,"lesson2"),

    // loadTextFileAsync(env,"sample_input"),
    // loadTextFileAsync(env,"sample_pictureSpec"),
    // loadTextFileAsync(env,"sample_q1"),
    // loadTextFileAsync(env,"sample_q2"),

    loadTxtFileMapAsync(env,"sample_story_spec"),
    loadTxtFileMapAsync(env,"correct_button_logic_0011.btwee"),
    loadTxtFileMapAsync(env,"incorrect_button_logic_0011.btwee"),

    loadStoryTxtAsync(env,"story_lesson"),
    loadStoryTxtAsync(env,"story_prompt"),
    loadStyleTxtAsync(env),
    
    loadAssetAsync(env,"generating_0016.html"),
  ]);

  txtFileMap.set("twine_header",twine_header);
  txtFileMap.set("twine_scene",twine_scene);
  txtFileMap.set("twine_scene_url",twine_scene_url);
  txtFileMap.set("twine_footer",twine_footer);

  txtFileMap.set("twine_question",twine_question);
  txtFileMap.set("twine_response_scene",twine_response_scene);
  txtFileMap.set("twine_response_url",twine_response_url);
  // txtFileMap.set("lesson",lesson);

  // txtFileMap.set("sample_input",sample_input);
  // txtFileMap.set("sample_pictureSpec",sample_pictureSpec);
  // txtFileMap.set("sample_q1",sample_q1);
  // txtFileMap.set("sample_q2",sample_q2);

  txtFileMap.set("sample_story_spec",sample_story_spec);
  txtFileMap.set("correct_button_logic",correct_button_logic);
  txtFileMap.set("incorrect_button_logic",incorrect_button_logic);

  txtFileMap.set("story_lesson",story_lesson);
  txtFileMap.set("story_prompt",story_prompt);
  txtFileMap.set("story_style",story_style);

  txtFileMap.set("generating_html",generating_html);

  return txtFileMap;
}

