import React, { useEffect, useMemo, useState } from "react";
import {
  login,
  registerUser,
  fetchMessages,
  sendMessage,
  MESSAGES_WS_URL,
} from "./api";

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const datePart = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timePart = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} ${timePart}`;
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser(name, email, password);
      }

      const authRes = await login(email, password);

      // { result: { token }, user: { ... } }
      const token = authRes?.result?.token;
      const user = authRes?.user;

      if (!token || !user) {
        console.error("Resposta de login inválida:", authRes);
        throw new Error("Resposta de autenticação inválida do servidor");
      }

      onAuthenticated(token, user);
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-title">Chat</div>
      </header>

      <main className="app-main" style={{ justifyContent: "center" }}>
        <div className="auth-container">
          <div className="auth-title">
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Cadastro
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                Nome
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            )}

            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && (
              <div className="text-muted" style={{ color: "red" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Entrando..."
                  : "Cadastrando..."
                : mode === "login"
                ? "Entrar"
                : "Cadastrar e entrar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function ChatScreen({ user, token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [ws, setWs] = useState(null);

  // GET /messages?userId=<email> com Bearer <token>
  useEffect(() => {
    async function loadMessages() {
      try {
        const items = await fetchMessages(token, user.email);
        setMessages(items);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    }

    if (token && user?.email) {
      loadMessages();
    }
  }, [token, user?.email]);

  // WebSocket para receber novas mensagens
  useEffect(() => {
    if (!user?.email) return;

    const socket = new WebSocket(
      `${MESSAGES_WS_URL}/ws?userId=${encodeURIComponent(user.email)}`
    );

    socket.onopen = () => {
      console.log("WS conectado para", user.email);
    };

    socket.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        console.log("WS recebeu:", raw);

        let msgs = [];

        if (Array.isArray(raw)) {
          msgs = raw;
        } else {
          const candidate =
            raw.message || // { message: {...} }
            raw.data?.message || // { data: { message: {...} } }
            raw.data || // { data: {...} }
            raw; // {...}

          if (
            candidate &&
            candidate.content &&
            candidate.senderId &&
            candidate.receiverId
          ) {
            msgs = [candidate];
          }
        }

        if (msgs.length > 0) {
          // 👇 IGNORA mensagens que eu mesmo enviei,
          // porque já foram adicionadas pelo handleSendMessage
          const filtered = msgs.filter((msg) => msg.senderId !== user.email);

          if (filtered.length === 0) {
            return;
          }

          setMessages((prev) => [...prev, ...filtered]);
        } else {
          console.log("WS payload sem campos de mensagem conhecidos");
        }
      } catch (err) {
        console.log("WS mensagem não JSON:", event.data);
      }
    };

    socket.onclose = () => {
      console.log("WS desconectado para", user.email);
    };

    socket.onerror = (err) => {
      console.error("WS erro:", err);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user?.email]);

  const contacts = useMemo(() => {
    const map = new Map();

    for (const msg of messages) {
      const other = msg.senderId === user.email ? msg.receiverId : msg.senderId;

      if (!other) continue;

      const existing = map.get(other);
      const createdAtTime = new Date(msg.createdAt).getTime();

      if (!existing || createdAtTime > existing.lastMessageTime) {
        map.set(other, {
          email: other,
          lastMessage: msg.content,
          lastMessageTime: createdAtTime,
          lastMessageDate: msg.createdAt,
        });
      }
    }

    const arr = Array.from(map.values());
    arr.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    return arr;
  }, [messages, user.email]);

  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0].email);
    }
  }, [contacts, selectedContact]);

  const filteredMessages = useMemo(() => {
    if (!selectedContact) return [];

    return messages.filter((msg) => {
      const involvesSelected =
        (msg.senderId === user.email && msg.receiverId === selectedContact) ||
        (msg.senderId === selectedContact && msg.receiverId === user.email);

      return involvesSelected;
    });
  }, [messages, selectedContact, user.email]);

  function handleStartConversation() {
    const email = searchEmail.trim();
    if (!email) return;
    if (email === user.email) return;

    setSelectedContact(email);

    const exists = contacts.some((c) => c.email === email);
    if (!exists) {
      const fakeMessage = {
        id: `temp-${Date.now()}`,
        senderId: user.email,
        receiverId: email,
        content: "",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fakeMessage]);
    }

    setSearchEmail("");
  }

  // POST /messages com senderId, receiverId, content, createdAt + Bearer <token>
  async function handleSendMessage() {
    const text = messageText.trim();
    if (!text || !selectedContact) return;

    try {
      const payload = {
        senderId: user.email,
        receiverId: selectedContact,
        content: text,
        createdAt: new Date().toISOString(),
      };

      const sent = await sendMessage(token, payload);

      const message = sent.message || sent;

      // Aqui a gente continua adicionando a mensagem localmente,
      // para o remetente ver imediatamente:
      setMessages((prev) => [...prev, message]);
      setMessageText("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-title">Chat</div>
        <div className="app-header-user">
          <span className="chat-sidebar-user-name">{user.name}</span> (
          {user.email}){" "}
          <button
            type="button"
            onClick={onLogout}
            style={{
              marginLeft: 8,
              padding: "4px 8px",
              fontSize: 12,
              borderRadius: 4,
              border: "1px solid #ffffff",
              background: "transparent",
              color: "#ffffff",
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="chat-layout">
          <aside className="chat-sidebar">
            <div className="chat-sidebar-section chat-sidebar-user">
              <div>Logado como:</div>
              <div className="chat-sidebar-user-name">{user.name}</div>
              <div className="text-muted">{user.email}</div>
            </div>

            <div className="chat-sidebar-section chat-sidebar-search">
              <label>
                Iniciar conversa por e-mail:
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleStartConversation();
                    }
                  }}
                />
              </label>
              <button type="button" onClick={handleStartConversation}>
                Iniciar conversa
              </button>
            </div>

            <div className="chat-sidebar-conversations">
              {contacts.length === 0 && (
                <div className="chat-conversation-item">
                  <span>Nenhuma conversa ainda</span>
                  <small>Use a busca para iniciar uma.</small>
                </div>
              )}

              {contacts.map((c) => (
                <div
                  key={c.email}
                  className={
                    "chat-conversation-item" +
                    (selectedContact === c.email ? " active" : "")
                  }
                  onClick={() => setSelectedContact(c.email)}
                >
                  <span>{c.email}</span>
                  {c.lastMessage && (
                    <small>
                      {c.lastMessage.slice(0, 30)}
                      {c.lastMessage.length > 30 ? "..." : ""}
                    </small>
                  )}
                  {c.lastMessageDate && (
                    <div className="text-muted">
                      {new Date(c.lastMessageDate).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <section className="chat-main">
            <div className="chat-main-header">
              <div>
                <div className="chat-main-header-title">
                  {selectedContact || "Nenhum contato selecionado"}
                </div>
                <div className="chat-main-header-subtitle">
                  {selectedContact
                    ? `Conversando com ${selectedContact}`
                    : "Selecione ou inicie uma conversa na barra lateral."}
                </div>
              </div>
            </div>

            <div className="chat-messages-container">
              {!selectedContact && (
                <div className="text-muted">Nenhuma conversa selecionada.</div>
              )}

              {selectedContact &&
                filteredMessages
                  .filter((msg) => msg.content)
                  .map((msg) => {
                    const isMe = msg.senderId === user.email;

                    return (
                      <div
                        key={msg.id || `${msg.senderId}-${msg.createdAt}`}
                        className={
                          "chat-message-row " + (isMe ? "me" : "other")
                        }
                      >
                        <div className="chat-message-bubble">
                          <div>{msg.content}</div>
                          <div className="chat-message-meta">
                            {formatTimestamp(msg.createdAt)}{" "}
                            {isMe ? "(Você)" : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {selectedContact && (
              <div className="chat-input-container">
                <textarea
                  placeholder={`Mensagem para ${selectedContact}`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button type="button" onClick={handleSendMessage}>
                  Enviar
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const storedUser = window.localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      }
    }
  }, []);

  function handleAuthenticated(newToken, newUser) {
    if (!newToken || !newUser) {
      console.error(
        "handleAuthenticated chamado sem token/usuário válidos",
        newToken,
        newUser
      );
      return;
    }

    setToken(newToken);
    setUser(newUser);
    window.localStorage.setItem("token", newToken);
    window.localStorage.setItem("user", JSON.stringify(newUser));
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.location.reload();
  }

  if (!token || !user) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return <ChatScreen user={user} token={token} onLogout={handleLogout} />;
}
