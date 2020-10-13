/*
  Cloufare 2020 intern assignment
  Author: Abdullah Sahapdeen
  Date: 2020-10-09
*/

// Links Object
let links = [
  {
    name: 'Google',
    url: 'https://www.google.com/',
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/',
  },
  {
    name: 'Cloudfare Workers',
    url: 'https://workers.cloudflare.com/',
  },
]

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  } else if (contentType.includes('application/text')) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    let content = "";
    for(let i = 0; i<links.length; i++){
      content += "<a href=\"" + links[i].url + "\">" + links[i].name + "</a>"
    }

    element.setInnerContent(content, { html: true});
  }
}

// Handle the request
async function handleRequest(request) {
  // Get the url and split it
  const parts = request.url.split('/')

  // If the path is links
  if (parts[3] == 'links') {
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json' },
    })
  }

  // Return static page for other paths
  const init = {
    headers: {
      'content-type': 'text/html',
    },
  }

  const rewriter = new HTMLRewriter().on(
    'div#links',
    new LinksTransformer(links),
  )


  const url = 'https://static-links-page.signalnerve.workers.dev'
  const response = await fetch(url, init)
  const newResponse = await rewriter.transform(response)
  
  const results = await gatherResponse(newResponse)
  return new Response(results, init); 
}

// The event listener
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
