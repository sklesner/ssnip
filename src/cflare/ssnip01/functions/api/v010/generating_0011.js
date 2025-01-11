


async function makeHtml(env, emojiTxt) {
  const templateP = await env.ASSETS.fetch('https://joe.ackop.com/assets/generating_0011.html');
  const template = await templateP.text();
  return await template.replace(/<emojiTxt>/g, emojiTxt);
}

export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const done = url.searchParams.get('done')
    const emojiTxt = url.searchParams.get('e')

    // if (done) {
    //   // Simulate a long-running operation
    // //   await new Promise(resolve => setTimeout(resolve, 10000));
    //   return new Response('Computation completed!');
    // } 

    const html = await makeHtml(env, emojiTxt);
  
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });

}

