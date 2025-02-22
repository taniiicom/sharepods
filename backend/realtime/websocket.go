package realtime

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type WebSocketManager struct {
	clients    map[string]map[*websocket.Conn]bool
	broadcast  chan message
	register   chan subscription
	unregister chan subscription
}

type subscription struct {
	groupID string
	conn    *websocket.Conn
}

type message struct {
	groupID string
	data    []byte
}

type numPeopleMessage struct {
	Type      string `json:"type"`
	NumPeople int    `json:"num_people"`
}

func NewWebSocketManager() *WebSocketManager {
	return &WebSocketManager{
		clients:    make(map[string]map[*websocket.Conn]bool),
		broadcast:  make(chan message),
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

			// クライアント数を通知
			m.notifyNumPeople(sub.groupID)

		case sub := <-m.unregister:
			if clients, ok := m.clients[sub.groupID]; ok {
				if _, exists := clients[sub.conn]; exists {
					delete(clients, sub.conn)
					sub.conn.Close()

					// クライアント数を通知
					m.notifyNumPeople(sub.groupID)
				}
			}

		case msg := <-m.broadcast:
			if clients, ok := m.clients[msg.groupID]; ok {
				for conn := range clients {
					if err := conn.WriteMessage(websocket.TextMessage, msg.data); err != nil {
						conn.Close()
						delete(clients, conn)

						// クライアント数を通知
						m.notifyNumPeople(msg.groupID)
					}
				}
			}
		}
	}
}

func (m *WebSocketManager) JoinGroup(groupID string, conn *websocket.Conn) {
	m.register <- subscription{groupID: groupID, conn: conn}
	go m.listenForMessages(groupID, conn)
}

func (m *WebSocketManager) listenForMessages(groupID string, conn *websocket.Conn) {
	defer func() {
		m.unregister <- subscription{groupID: groupID, conn: conn}
		conn.Close()
	}()

	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// 受信したメッセージを同じグループ内の全クライアントにブロードキャスト
		m.broadcast <- message{groupID: groupID, data: data}
	}
}

func (m *WebSocketManager) notifyNumPeople(groupID string) {
	if clients, ok := m.clients[groupID]; ok {
		numPeople := len(clients)
		msg := numPeopleMessage{
			Type:      "numPeople",
			NumPeople: numPeople,
		}

		data, err := json.Marshal(msg)
		if err != nil {
			return
		}

		// 現在のクライアント数をグループ内の全クライアントに通知
		for conn := range clients {
			if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
				conn.Close()
				delete(clients, conn)
			}
		}
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func HandleWebSocketConnection(c echo.Context, manager *WebSocketManager) error {
	groupID := c.QueryParam("id")
	if groupID == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "ID is required"})
	}

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	manager.JoinGroup(groupID, ws)
	return nil
}
