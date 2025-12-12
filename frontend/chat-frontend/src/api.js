const USERS_API_URL = "http://localhost:3334";
const MESSAGES_API_URL = "http://localhost:3333";

export async function login(email, password) {
  const res = await fetch(`${USERS_API_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Falha ao autenticar");
  }

  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${USERS_API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Falha ao cadastrar usuário");
  }

  return res.json();
}

// GET /messages?userId=<email> + Bearer <token>
export async function fetchMessages(token, userId) {
  if (!token || !userId) {
    throw new Error("Token e userId são obrigatórios para buscar mensagens");
  }

  const res = await fetch(
    `${MESSAGES_API_URL}/messages?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Falha ao buscar mensagens");
  }

  const data = await res.json();

  if (data.items) {
    return data.items;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

// POST /messages com senderId, receiverId, content, createdAt + Bearer <token>
export async function sendMessage(
  token,
  { senderId, receiverId, content, createdAt }
) {
  if (!token) {
    throw new Error("Token é obrigatório para enviar mensagem");
  }

  const res = await fetch(`${MESSAGES_API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      senderId,
      receiverId,
      content,
      createdAt,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Falha ao enviar mensagem");
  }

  const data = await res.json();

  if (data.message) {
    return data.message;
  }

  return data;
}

export const MESSAGES_WS_URL = "ws://localhost:3333";
