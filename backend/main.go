package main

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/taniiicom/sharepods/backend/config"
	"github.com/taniiicom/sharepods/backend/db/schema/db"
)

func main() {
	e := echo.New()

	databaseURL, ok := config.DatabaseURL()
	if !ok {
		e.Logger.Error("Database URL not found")
		os.Exit(1)
		return
	}

	client := db.NewClient(db.WithDatasourceURL(databaseURL))
	if err := client.Prisma.Connect(); err != nil {
		e.Logger.Error(err)
		os.Exit(1)
		return
	}
	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":8080"))
}
