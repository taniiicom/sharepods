package realtime

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type WebSocketManager struct {
	clients    map[string]map[*websocket.Conn]bool
	register   chan subscription
	unregister chan subscription
}

type subscription struct {
	groupID string
	conn    *websocket.Conn
}

func NewWebSocketManager() *WebSocketManager {
	return &WebSocketManager{
		clients:    make(map[string]map[*websocket.Conn]bool),
		register:   make(chan subscription),
		unregister: make(chan subscription),
	}
}

func (m *WebSocketManager) Run() {
	for {
		select {
		case sub := <-m.register:
			if m.clients[sub.groupID] == nil {
				m.clients[sub.groupID] = make(map[*websocket.Conn]bool)
			}
			m.clients[sub.groupID][sub.conn] = true
		case sub := <-m.unregister:
			if clients, ok := m.clients[sub.groupID]; ok {
				if _, exists := clients[sub.conn]; exists {
					delete(clients, sub.conn)
					sub.conn.Close()
				}
			}
		}
	}
}

func (m *WebSocketManager) JoinGroup(groupID string, c echo.Context) {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return
	}
	m.register <- subscription{groupID: groupID, conn: ws}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func HandleWebSocketConnection(c echo.Context, manager *WebSocketManager) error {
	groupID := c.QueryParam("group")
	if groupID == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "group ID is required"})
	}

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	manager.register <- subscription{groupID: groupID, conn: ws}
	return nil
}
