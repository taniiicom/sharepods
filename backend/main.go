package main

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/taniiicom/sharepods/backend/config"
	"github.com/taniiicom/sharepods/backend/handler"
	db "github.com/taniiicom/sharepods/backend/infrastructure/datamodel/dbmodel"
	"github.com/taniiicom/sharepods/backend/realtime"
)

func main() {
	e := echo.New()

	e.Debug = true
	e.Use(middleware.Logger())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOriginFunc: func(origin string) (bool, error) {
			// 本来ならちゃんとoriginを見るべきだが、ハッカソンなので必ずtrueを返すようにする
			return true, nil
		},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: false,
	}))

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

	wsManager := realtime.NewWebSocketManager()
	go wsManager.Run()

	handler := handler.NewHandler(client, wsManager)

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	e.GET("/watchparty", handler.GetWatchParty)
	e.POST("/watchparty", handler.CreateOrUpdateWatchParty)

	e.GET("/ws", func(c echo.Context) error {
		return realtime.HandleWebSocketConnection(c, wsManager)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
