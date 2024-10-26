#!/usr/bin/env bash
set -e

go run github.com/steebchen/prisma-client-go db push --schema db/schema/schema.prisma

/app/sharepods-backend
