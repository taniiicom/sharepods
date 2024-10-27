# backend

## ローカルでサーバーを起動する

Docker Composeで起動できます。

```shell
$ docker compose up --build
```

```shell
$ go run github.com/steebchen/prisma-client-go db push --schema db/schema/schema.prisma

```

```shell
$ curl "http://localhost:8080/watchparty?lat=1&lon=1"
Hello, World!
```
