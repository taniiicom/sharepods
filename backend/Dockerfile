# syntax = docker/dockerfile:1@sha256:39b85bbfa7536a5feceb7372a0817649ecb2724562a38360f4d6a7782a409b14

# 参考: https://zenn.dev/masibw/articles/57a47a7381b9b3

####################### Build stage #######################
FROM --platform=$BUILDPLATFORM golang:1.23 AS builder

# マルチプラットフォームビルドすると自動で渡ってくる
ARG TARGETARCH

ENV CGO_ENABLED=0

WORKDIR /app

# 先に依存ライブラリだけダウンロードすることでDockerのキャッシュを効きやすくする
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
     GOARCH=${TARGETARCH} go mod download

COPY . ./

# Prisma Clientを生成
RUN go run github.com/steebchen/prisma-client-go generate --schema db/schema/schema.prisma

# ビルドから不要な情報を取り除く
# https://qiita.com/ssc-ynakamura/items/da37856f7f217d708a07
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    GOARCH=${TARGETARCH} go build -o sharepods-backend -ldflags="-s -w" -trimpath ./


####################### Run stage #######################
# https://github.com/GoogleContainerTools/distroless
FROM gcr.io/distroless/base-debian11
WORKDIR /app

COPY --from=builder /app/sharepods-backend /app/sharepods-backend

CMD [ "/app/sharepods-backend" ]
