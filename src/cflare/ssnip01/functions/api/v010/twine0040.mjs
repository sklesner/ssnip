import * as GPT from '../model/gpt.mjs';
import * as GROQ from '../model/groq.mjs';
import * as CLAUDE from '../model/claude.mjs';
import * as STATIC from '../model/static.mjs';

async function makeHash(text) {
  const crypto = globalThis.crypto;

  function bufferToHex(buffer) {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
  }

  async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      return bufferToHex(hashBuffer);
  }

  let sha256Hash = await sha256(text);
  return sha256Hash.slice(0, 6);
}

function sceneTest(content) {
  let regex = /[\s\S]*?(<scene>[\s\S]{24,}?<\/scene>[\s\S]*?){6}/ism;
  return regex.test(content);
}

function questionTest(content) {
  let regex = /<question>[\s\S]+?<\/question>[\s\S]*?<answer>[\s\S]+?<\/answer>[\s\S]*?(<decoy>[\s\S]+?<\/decoy>[\s\S]*?){3}/ism;
  return regex.test(content);
}

function pictureTest(content) {
  let regex = /[\s\S]?(<picture>[\s\S]{16,}?<\/picture>[\s\S]?){6}/ism;
  return regex.test(content);
}

async function makeStory(env, txtFileMap, lesson, emoji) {
  let storySpec;
  for (let i = 0; i < 4; i++) {
      if (i > 0) console.log('story try: ' + (i - 1));
      
      storySpec = // STORY LLM CONFIG
        //  STATIC.sendStoryRequest(env, txtFileMap, lesson, emoji);
        await GPT.sendStoryRequest(env, lesson, emoji);
        // await CLAUDE.sendStoryRequest(env, lesson, emoji);
        // await GROQ.sendStoryRequest(env, lesson, emoji);
      
      if (sceneTest(storySpec)) break;
  }

  if (!sceneTest(storySpec)) {
      throw new Error('Failed to generate a valid story response after multiple attempts');
  }

  return storySpec;
}


function makeSceneArray(text) {
  const sceneRegex = /<scene>([\s\S]*?)<\/scene>/g;
  const scenes = [];
  let match;

  while ((match = sceneRegex.exec(text)) !== null) {
    scenes.push(match[1].trim());
  }

  return scenes;
}

function makePictureArray(text) {
  const pictureRegex = /<picture>([\s\S]*?)<\/picture>/g;
  const pictures = [];
  let match;

  while ((match = pictureRegex.exec(text)) !== null) {
    pictures.push(match[1].trim());
  }

  return pictures;
}


function makeQuestionDict(text) {
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


function makeTwineButton(template, buttonText, nextPageName) {
return template
  .replace(/<buttonText>/g, buttonText)
  .replace(/<nextPageName>/g, nextPageName)
  ;
}

function makeTwineHeader(template, storyName) {
  return template
    .replace(/<storyName>/g, storyName)
    ;
}

function makeTwineScene(template, storyId, pid, pageName, nextPageName, sceneText, emoji) {
  return template
    .replace(/<storyId>/g,storyId)
    .replace(/<pid>/g, pid)
    .replace(/<pageName>/g, pageName)
    .replace(/<nextPageName>/g, nextPageName)
    .replace(/<sceneText>/g, sceneText)
    .replace(/<emoji>/g, emoji)
    ;
}

function makeTwineSceneUrl(template, storyId, pid, pageName, sceneText, bText, bAction, emoji) {
  return template
    .replace(/<storyId>/g,storyId)
    .replace(/<pid>/g, pid)
    .replace(/<pageName>/g, pageName)
    .replace(/<sceneText>/g, sceneText)
    .replace(/<bText>/g, bText)
    .replace(/<bAction>/g, bAction)
    .replace(/<emoji>/g, emoji)
    ;
}

function makeTwineFooter(template, storyName) {
  return template
  .replace(/<storyName>/g, storyName)
  ;
}

function makeTwineQuestion(template, pid, pageName, questionText,
  b1Text, b1Action,
  b2Text, b2Action,
  b3Text, b3Action,
  b4Text, b4Action
) {
  return template
  .replace(/<pid>/g, pid)
  .replace(/<pageName>/g, pageName)
  .replace(/<questionText>/g, questionText)
  
  .replace(/<b1Text>/g, b1Text)
  .replace(/<b1Action>/g, b1Action)
  
  .replace(/<b2Text>/g, b2Text)
  .replace(/<b2Action>/g, b2Action)

  .replace(/<b3Text>/g, b3Text)
  .replace(/<b3Action>/g, b3Action)

  .replace(/<b4Text>/g, b4Text)
  .replace(/<b4Action>/g, b4Action)
  ;
}

function makeTwineResponseScene(template, pid, pageName, messageText, bText, bAction){
  return template
  .replace(/<pid>/g, pid)
  .replace(/<pageName>/g, pageName)
  .replace(/<messageText>/g, messageText)
  .replace(/<bText>/g, bText)
  .replace(/<bAction>/g, bAction)
}

function makeTwineResponseUrl(template, pid, pageName, messageText, bText, bAction){
  return template
  .replace(/<pid>/g, pid)
  .replace(/<pageName>/g, pageName)
  .replace(/<messageText>/g, messageText)
  .replace(/<bText>/g, bText)
  .replace(/<bAction>/g, bAction)
}

async function loadTextFileAsync(env,filePath) {
  // try {
    // return await fs.readFile(filePath, 'utf8');

    var stuff = await env.ASSETS.fetch('https://joe.ackop.com/assets/txtFileMap/'+ filePath + '.txt');

    return await stuff.text();
  // } catch (error) {
  //   console.error(`Error reading file from ${filePath}:`, error);
  //   return '';
  // }
}

async function makeTwine(env, txtFileMap, storyId,storyName,storySpec,emojiDelimited){
  const headerTemplate = txtFileMap.get("twine_header");
  const sceneTemplate = txtFileMap.get("twine_scene");
  const sceneUrlTemplate = txtFileMap.get("twine_scene_url");
  const footerTemplate = txtFileMap.get("twine_footer");

  const sceneArray = makeSceneArray(storySpec);

  const emojiArray = emojiDelimited.split('-'); 

  return makeTwineHeader(headerTemplate, storyName)
    + makeTwineScene(sceneTemplate, storyId, "2", "2", "3", sceneArray[0], emojiArray[0])
    + makeTwineScene(sceneTemplate, storyId, "3", "3", "4", sceneArray[1], emojiArray[1])
    + makeTwineScene(sceneTemplate, storyId, "4", "4", "5", sceneArray[2], emojiArray[2])
    + makeTwineScene(sceneTemplate, storyId, "5", "5", "6", sceneArray[3], emojiArray[3])
    + makeTwineScene(sceneTemplate, storyId, "6", "6", "7", sceneArray[4], emojiArray[4])
    // + makeTwineScene(sceneTemplate, storyId, "7", "7", "2", sceneArray[5], emojiArray[5])
    + makeTwineSceneUrl(sceneUrlTemplate, storyId, "7", "7", sceneArray[5], "Quiz Time!", `https://quiz.ackop.com/${emojiDelimited}_quiz.html`, emojiArray[5])
    + makeTwineFooter(footerTemplate, storyName);
}

function getLesson(ctx) {
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

async function makeGeneratingHtml(env, emojiDelimited) {
  const templateP = await env.ASSETS.fetch('https://joe.ackop.com/assets/generating_0013.html');
  const template = await templateP.text();
  return await template.replace(/<emojiTxt>/g, emojiDelimited);
}

async function genPictureSpec(env, txtFileMap, storySpec) {
  let imageDesc;

  for (let i = 0; i < 4; i++) {
    if (i > 0) console.log('pictures try: ' + (i - 1));

    imageDesc = // PICTURE LLM CONFIG
      //  STATIC.sendPicturesRequest(env, txtFileMap, storySpec);
      // await GPT.sendPicturesRequest(env, storySpec);
      await GROQ.sendPicturesRequest(env, storySpec);
      // await CLAUDE.sendPicturesRequest(env, storySpec);
    
    if (pictureTest(imageDesc)) break;
  }

  if (!pictureTest(imageDesc)) {
      throw new Error('Failed to generate a valid picture descriptions response after multiple attempts');
  }

  const pictureArray = makePictureArray(imageDesc);

  return pictureArray;
}

async function imageGen(env, imageDesc, imageName) {
  
  const image = await env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      // prompt: imageDesc + " Whimsical Expressive Playful Energetic Loose Sketchy Humorous Vibrant Dynamic Spontaneous Characterful Imaginative",
      prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton",
      // prompt: imageDesc + " in the art style of Edward Gorey, Tim Burton, Shel Silverstein, Gahan Wilson",
      negative_prompt: "Disfigured, blurry, nude, sloppy, deformed, mutated, ugly",
      // height: 768, width: 768,
      height: 1024, width: 1024,
    }
  );

  if (image) {
    await env.TWINE_BUCKET.put(imageName + '.png', image);
  }
}

async function twineImageGen(env, imageDescs, storyId) {
  await Promise.all([
    // PICTURE COUNT CONFIG
    imageGen(env, imageDescs[0], `${storyId}_picture_p2`),
    imageGen(env, imageDescs[1], `${storyId}_picture_p3`),
    imageGen(env, imageDescs[2], `${storyId}_picture_p4`),
    imageGen(env, imageDescs[3], `${storyId}_picture_p5`),
    imageGen(env, imageDescs[4], `${storyId}_picture_p6`),
    imageGen(env, imageDescs[5], `${storyId}_picture_p7`)
  ]);
}


async function genQuestionSpec(env, txtFileMap, storySpec) {
  let q1, q2;
  let q1Valid = false, q2Valid = false;
  let attempts = 0;
  const maxAttempts = 4;

  while ((!q1Valid || !q2Valid) && attempts < maxAttempts) {
    attempts++;

    if (!q1Valid) {
      try {
        // Q1 LLM CONFIG
        // q1 = STATIC.sendQuestion1Request(env, txtFileMap, storySpec);
        // q1 = await GPT.sendQuestion1Request(env, storySpec);
        q1 = await GROQ.sendQuestion1Request(env, storySpec);
        // q1 = await CLAUDE.sendQuestion1Request(env, storySpec);

        q1Valid = questionTest(q1);
      } catch (error) {
        console.error(`Error in q1 attempt ${attempts}:`, error);
      }
    }

    if (!q2Valid) {
      try {
        // Q2 LLM CONFIG
        // q2 = STATIC.sendQuestion2Request(env, txtFileMap, storySpec);
        // q2 = await GPT.sendQuestion2Request(env, storySpec);
        q2 = await GROQ.sendQuestion2Request(env, storySpec);
        // q2 = await CLAUDE.sendQuestion2Request(env, storySpec);

        q2Valid = questionTest(q2);
      } catch (error) {
        console.error(`Error in q2 attempt ${attempts}:`, error);
      }
    }

    if (attempts > 1) {
      console.log(`Retry attempt: ${attempts - 1}`);
    }
  }

  if (!q1Valid) {
    throw new Error('Failed to generate a valid question1 spec response after multiple attempts');
  }

  if (!q2Valid) {
    throw new Error('Failed to generate a valid question2 spec response after multiple attempts');
  }

  const q1Dict = makeQuestionDict(q1);
  const q2Dict = makeQuestionDict(q2);

  return [q1Dict, q2Dict];
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

async function makeQuizTwine(env, txtFileMap, storyName, questionSpec) {
  const headerTemplate = txtFileMap.get("twine_header");
  const questionTemplate = txtFileMap.get("twine_question");
  const responseSceneTemplate = txtFileMap.get("twine_response_scene");
  const responseUrlTemplate = txtFileMap.get("twine_response_url");
  const footerTemplate = txtFileMap.get("twine_footer");

  const question1 = questionSpec[0].question;
  const options1 = shuffleArray([
    {text: questionSpec[0].answer, action: 'c1'},
    ...questionSpec[0].decoys.map(decoy => ({text: decoy, action: 'r1'}))
  ]);
  
  const question2 = questionSpec[1].question;
  const options2 = shuffleArray([
    {text: questionSpec[1].answer, action: 'f'},
    ...questionSpec[1].decoys.map(decoy => ({text: decoy, action: 'r2'}))
  ]);

  // console.log("constructing quiz")

  return makeTwineHeader(headerTemplate, storyName)
  + makeTwineQuestion(questionTemplate, 2, "q1", question1, options1[0].text, options1[0].action, options1[1].text, options1[1].action, options1[2].text, options1[2].action, options1[3].text, options1[3].action)
  + makeTwineResponseScene(responseSceneTemplate, 3, "r1", "Incorrect", "Try again", "q1")
  + makeTwineResponseScene(responseSceneTemplate, 4, "c1", "Correct!", "Next Question", "q2")
  + makeTwineQuestion(questionTemplate, 5, "q2", question2, options2[0].text, options2[0].action, options2[1].text, options2[1].action, options2[2].text, options2[2].action, options2[3].text, options2[3].action)
  + makeTwineResponseScene(responseSceneTemplate, 6, "r2", "Incorrect", "Try again", "q2")
  + makeTwineResponseUrl(responseUrlTemplate, 7, "f", "Good answers!", "Try another story?", "https://joe.ackop.com/")
  + makeTwineFooter(footerTemplate, storyName);
}


async function loadTxtFiles(env) {
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
  
  ] = await Promise.all([
    loadTextFileAsync(env, "twine_header"),
    loadTextFileAsync(env, "twine_scene"),
    loadTextFileAsync(env, "twine_scene_url"),
    loadTextFileAsync(env, "twine_footer"),
  
    loadTextFileAsync(env, "twine_question"),
    loadTextFileAsync(env, "twine_response_scene"),
    loadTextFileAsync(env, "twine_response_url"),
    loadTextFileAsync(env, "lesson"),

    loadTextFileAsync(env, "sample_input"),
    loadTextFileAsync(env, "sample_pictureSpec"),
    loadTextFileAsync(env, "sample_q1"),
    loadTextFileAsync(env, "sample_q2"),
  ]);

  txtFileMap.set("twine_header", twine_header);
  txtFileMap.set("twine_scene", twine_scene);
  txtFileMap.set("twine_scene_url", twine_scene_url);
  txtFileMap.set("twine_footer", twine_footer);

  txtFileMap.set("twine_question", twine_question);
  txtFileMap.set("twine_response_scene", twine_response_scene);
  txtFileMap.set("twine_response_url", twine_response_url);
  txtFileMap.set("lesson", lesson);

  txtFileMap.set("sample_input", sample_input);
  txtFileMap.set("sample_pictureSpec", sample_pictureSpec);
  txtFileMap.set("sample_q1", sample_q1);
  txtFileMap.set("sample_q2", sample_q2);

  return txtFileMap;
}

import { createClient } from '@supabase/supabase-js'

async function assetRegister(
  supabase,
  asset_type_id,
  external_id,
  words
){
  const { data, error } = await supabase
    .from('asset')
    .insert([
      {
        'asset_type_id':asset_type_id,
        'external_id': external_id,
        'words': words,
      },
    ])
    .select()

  if (error) throw error

  return data[0].asset_id
}

async function assetConfirm(
  supabase,
  asset_id,
  // worker_label,
  // log_text
){
  const { data, error } = await supabase
    .from('confirm')
    .insert([
      {
        asset_id,
        // worker_label,
        // log_text
      },
    ])
    .select()

  if (error) throw error

  return data[0].asset_id
}

async function assetAttempt(
  supabase,
  asset_id,
  // worker_label
){
  const { data, error } = await supabase
    .from('attempt')
    .insert([
      {
        'asset_id': asset_id,
        // 'worker_label': worker_label
      },
    ])
    .select()

  if (error) throw error

  return data[0].asset_id
}


export async function onRequest(context) {  
  const { env, request } = context;
  
  var ctx = {
    "env": env,
    "request": request,
  }

  const url = new URL(request.url);
  const emojiDelimited = url.searchParams.get('e') || "☕-💎-🎶-👩-🗽-🍞";
  const storyName = emojiDelimited.replace(/-/g, '');
    
  const backgroundWork = async () => {

    const supabase = createClient(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY
    )

    ctx.supabase = supabase;

    const txtFileMap = await loadTxtFiles(env);

    ctx.txtFileMap = txtFileMap;

    const lesson = await getLesson(ctx)
    console.log("Lesson:", lesson); // Debug log

    const asset_id = await assetRegister(supabase, 's', emojiDelimited, lesson)
    const storySpec = await makeStory(env, txtFileMap, lesson,storyName);

    // const storyId = await makeHash(storySpec)
    const storyId = asset_id
    
    const storyTwine = await makeTwine(env, txtFileMap, storyId,storyName,storySpec,emojiDelimited);
    
    await env.STORY_BUCKET.put(
      storyId + '_' + emojiDelimited + '.txt'
      , storySpec
      , {
        httpMetadata: {
          contentType: 'text/plain',
        },
      });
      
      if (storyTwine) {
        
        await env.TWINE_BUCKET.put(
          // storyId + '.html'
          emojiDelimited + '.html'
          , storyTwine
          , {
            httpMetadata: {
              contentType: 'text/html',
            },
          });

          await assetConfirm(supabase, asset_id)
    }

    // TODO - add picture generation asset tracking
    // TODO - add quiz generation asset tracking
    
    const pictureSpec = await genPictureSpec(env, txtFileMap, storySpec);
    await twineImageGen(env,pictureSpec,storyId);
    
    const questionSpec = await genQuestionSpec(env, txtFileMap, storySpec);
    const quizTwine = await makeQuizTwine(env, txtFileMap, storyName, questionSpec);
    // console.log(testTwine)  
    
    await env.QUIZ_BUCKET.put(
      emojiDelimited + '_quiz.html'
      , quizTwine
      , {
      httpMetadata: {
          contentType: 'text/html',
      },
    });

    // console.log("done!")
  };

  context.waitUntil(backgroundWork());

  // Create a ReadableStream to send updates to the client
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send initial HTML
      const initialHtml = await makeGeneratingHtml(env, emojiDelimited);
      controller.enqueue(encoder.encode(initialHtml));

      // Send updates periodically
      let count = 0;
      const maxUpdates = 10; // Adjust as needed
      const interval = setInterval(async () => {
        if (count >= maxUpdates) {
          clearInterval(interval);
          controller.close();
          return;
        }
        const updateHtml = `<script>document.getElementById('status').textContent = '(${count + 1}/${maxUpdates})';</script>`;
        controller.enqueue(encoder.encode(updateHtml));
        count++;
      }, 5000); 
    }
  });

  // Return a streaming response
  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
  // } catch (error) {
  //   console.error('Error:', error);
  //   return new Response(`Error at ${new Date().toISOString()} details ` + error, { 
  //     status: 404,
  //     headers: { 'Content-Type': 'text/plain' }
  //   });
  // }
  
  // // If twineContent is falsy, return a 404 response
  // return new Response('Not Found', { status: 404 });
}
