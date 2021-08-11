
const http = require("http")
const https = require("https")
const url = require('url')
const querystring = require('querystring')

const handler = (req, res) => {
    const {
        pathname,
        query,
    } = url.parse(req.url)

    if (pathname === '/p') {
        const options = querystring.parse(query)
        if (!options.url) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end(`url required`);
            return
        }

        const {
            host,
        } = url.parse(options.url)

        const headers = {
            host,
        }

        if (req.headers['user-agent']) {
            headers['user-agent'] = req.headers['user-agent']
        }

        const agent = options.url.startsWith('https') ? https : http

        agent.get(options.url, {
            headers,
        }, (url_res) => {
            for (const key in url_res.headers) {
                res.setHeader(key, url_res.headers[key])
            }
            res.setHeader('access-control-allow-origin', '*')
            url_res.pipe(res)
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Cannot GET ${pathname}`);
    }
}

const port = process.env.PORT || 3129
http.createServer(handler).listen(port, () => {
    console.log(`proxy server started at http://localhost:${port}`)
})
