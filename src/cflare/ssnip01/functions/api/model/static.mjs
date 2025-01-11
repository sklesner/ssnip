export function sendStoryRequest(env, txtFileMap, lesson, emoji) {
    // let file = await env.ASSETS.fetch('https://joe.ackop.com/assets/story/sample_input.txt');
    let file = txtFileMap.get("sample_input");
    console.log('loading static story');
    return file;
}

export function sendPicturesRequest(env, txtFileMap, storySpec) {
    // let file = await env.ASSETS.fetch('https://joe.ackop.com/assets/twine/sample_pictureSpec.txt');
    let file = txtFileMap.get("sample_pictureSpec");
    console.log('loading static picture desc');
    return file;
}


export function sendQuestion1Request(env, txtFileMap, storySpec) {
    // let file = await env.ASSETS.fetch('https://joe.ackop.com/assets/twine/sample_q1.txt');
    let file = txtFileMap.get("sample_q1");
    console.log('loading q1');
    return file;
}

export function sendQuestion2Request(env, txtFileMap, storySpec) {
    // let file = await env.ASSETS.fetch('https://joe.ackop.com/assets/twine/sample_q2.txt');
    let file = txtFileMap.get("sample_q2");
    console.log('loading q2');
    return file;
}