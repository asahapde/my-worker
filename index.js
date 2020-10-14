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
    let id = element.getAttribute('id')

    // Populate the links div
    if (id == 'links') {
      let content = ''
      for (let i = 0; i < links.length; i++) {
        content += '<a href="' + links[i].url + '">' + links[i].name + '</a>'
      }
      element.setInnerContent(content, { html: true })
    }

    // Remove display: none from profile div
    if (id == 'profile') {
      element.setAttribute('style', '')
    }

    // Set the profile image
    if (id == 'avatar') {
      element.setAttribute(
        'src',
        'https://media-exp1.licdn.com/dms/image/C4E35AQEK9ZGB5Yk3Cg/profile-framedphoto-shrink_200_200/0?e=1602723600&v=beta&t=Clc29YPhvBaSEh5Y7Fcq7zgb8JBvkXlrtXRjvRUIjmw',
      )
    }

    // set my name
    if (id == 'name') {
      element.setInnerContent('asahapde', { html: true })
    }

    // Remove display: none from social div
    if (id == 'social') {
      element.setAttribute('style', '')
    }

    // Populate the social div
    if (id == 'social') {
      let svgContent =
        '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn icon</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'

      let content =
        '<a href="' +
        'https://www.linkedin.com/in/abdullah-sahapdeen/' +
        '">' +
        '<svg>' +
        svgContent +
        '</svg>' +
        '</a>'
      element.setInnerContent(content, { html: true })
    }

    // Change title to my name
    if (element.tagName == "title") {
      element.setInnerContent("Abdullah Sahapdeen", { html: true })
    }

    if (element.tagName == "body") {
      element.setAttribute('class', 'bg-blue-400')
    }
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

  // Create the Html rewriter
  const rewriter = new HTMLRewriter().on('*', new LinksTransformer(links))

  // Fetch the static url page
  const url = 'https://static-links-page.signalnerve.workers.dev'
  const response = await fetch(url, init)

  // Rewrite the html with links
  const newResponse = await rewriter.transform(response)

  // Return the page as html
  const results = await gatherResponse(newResponse)
  return new Response(results, init)
}

// The event listener
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
