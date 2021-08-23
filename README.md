# http-get-pipe-server
simple http.get pipe server

## usage

```sh

npm start

curl http://localhost:3129/p?url=http://httpbin.org/ip
curl -X POST "http://localhost:3129/p?url=http://httpbin.org/post" -d '{"hello":"world"}'

```

## license

mit
