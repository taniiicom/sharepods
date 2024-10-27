package handler

import (
	"context"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/taniiicom/sharepods/backend/infrastructure/datamodel/apimodel"
	db "github.com/taniiicom/sharepods/backend/infrastructure/datamodel/dbmodel"
)

const tolerance = 0.00045 // 約50mの誤差

type handler struct {
	db *db.PrismaClient
}

func NewHandler(db *db.PrismaClient) *handler {
	return &handler{db: db}
}

// GetWatchParty - 緯度・経度の範囲内のレコードを取得
func (h *handler) GetWatchParty(c echo.Context) error {
	latStr := c.QueryParam("lat")
	lonStr := c.QueryParam("lon")

	if latStr == "" || lonStr == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "lat and lon are required",
		})
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "Invalid lat parameter",
		})
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "Invalid lon parameter",
		})
	}

	watchParty, err := h.FindWatchPartyInRange(lat, lon, tolerance)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{
			"message": "There is no watch party",
		})
	}

	if watchParty == nil {
		return c.JSON(http.StatusNotFound, echo.Map{
			"message": "No watch party found within the tolerance range",
		})
	}

	return c.JSON(http.StatusOK, watchParty)
}

// CreateOrUpdateWatchParty - UUIDが同じ場合は更新、そうでない場合は新規作成
func (h *handler) CreateOrUpdateWatchParty(c echo.Context) error {
	var req apimodel.CreateWatchpartyRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "Invalid request payload",
		})
	}

	watchParty, err := h.UpsertWatchParty(req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Failed to create or update watch party",
		})
	}

	return c.JSON(http.StatusOK, watchParty)
}

// FindWatchPartyInRange - 緯度・経度の誤差範囲内のレコードを検索
func (h *handler) FindWatchPartyInRange(lat, lon, tolerance float64) (*apimodel.Watchparty, error) {
	wp, err := h.db.WatchParty.FindFirst(
		db.WatchParty.Latitude.Gt(lat-tolerance),
		db.WatchParty.Latitude.Lt(lat+tolerance),
		db.WatchParty.Longitude.Gt(lon-tolerance),
		db.WatchParty.Longitude.Lt(lon+tolerance),
	).OrderBy(db.WatchParty.CreatedAt.Order(db.SortOrderDesc)).Exec(context.Background())
	if err != nil {
		return nil, err
	}

	return &apimodel.Watchparty{
		Id:       wp.ID,
		Lat:      float32(wp.Latitude),
		Lon:      float32(wp.Longitude),
		PlayTime: float32(wp.PlayTime),
		Url:      wp.URL,
	}, nil
}

// UpsertWatchParty - UUIDで一致する場合は更新、そうでない場合は新規作成
func (h *handler) UpsertWatchParty(req apimodel.CreateWatchpartyRequest) (*apimodel.Watchparty, error) {
	wp, err := h.db.WatchParty.UpsertOne(
		db.WatchParty.ID.Equals(req.Id),
	).Create(
		db.WatchParty.Latitude.Set(float64(req.Lat)),
		db.WatchParty.Longitude.Set(float64(req.Lon)),
		db.WatchParty.URL.Set(req.Url),
		db.WatchParty.PlayTime.Set(int(req.CurrentTime)),
		db.WatchParty.ID.Set(req.Id),
	).Update(
		db.WatchParty.Latitude.Set(float64(req.Lat)),
		db.WatchParty.Longitude.Set(float64(req.Lon)),
		db.WatchParty.URL.Set(req.Url),
		db.WatchParty.PlayTime.Set(int(req.CurrentTime)),
	).Exec(context.Background())
	if err != nil {
		return nil, err
	}

	return &apimodel.Watchparty{
		Id:       wp.ID,
		Lat:      float32(wp.Latitude),
		Lon:      float32(wp.Longitude),
		PlayTime: float32(wp.PlayTime),
		Url:      wp.URL,
	}, nil
}
