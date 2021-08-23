
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
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`url required`);
            return
        }

        const {
            host,
        } = url.parse(options.url)

        const headers = {
            host,
        }

        const method = options.method || req.method

        const req_headers = [
            'user-agent',
            'content-type',
        ]

        for (const h of req_headers) {
            if (req.headers[h]) {
                headers[h] = req.headers[h]
            }
        }

        const agent = options.url.startsWith('https') ? https : http

        const url_req = agent.request(options.url, {
            headers,
            method,
        }, (url_res) => {
            for (const key in url_res.headers) {
                res.setHeader(key, url_res.headers[key])
            }
            res.setHeader('access-control-allow-origin', '*')
            url_res.pipe(res)
        })

        url_req.on('error', e => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Cannot ${method} ${options.url}, ${e.message}`);
        })

        req.pipe(url_req)

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Cannot ${req.method} ${pathname}`);
    }
}

const port = process.env.PORT || 3129
http.createServer(handler).listen(port, () => {
    console.log(`proxy server started at http://localhost:${port}`)
})
