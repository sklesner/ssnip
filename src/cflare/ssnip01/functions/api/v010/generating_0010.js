export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const done = url.searchParams.get('done') 

    if (done) {
      // Simulate a long-running operation
    //   await new Promise(resolve => setTimeout(resolve, 10000));
      return new Response('Computation completed!');
    } 

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Countdown Timer</title>
        <script>
          async function startCountdown() {
            const timerElement = document.getElementById('timer');
            for (let i = 10; i > 0; i--) {
              timerElement.textContent = i;
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            const response = await fetch('/api/wait0010?done=1');
            const result = await response.text();
            timerElement.textContent = result;
          }
        </script>
      </head>
      <body onload="startCountdown()">
        <h1>Operation in Progress</h1>
        <p>Please wait: <span id="timer">10</span></p>
      </body>
      </html>
    `;
  
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });

}