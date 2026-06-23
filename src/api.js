import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://ec2-43-201-28-82.ap-northeast-2.compute.amazonaws.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || fallbackMessage;
}

export function getMemberId(data) {
  return data?.member_id ?? data?.memberId ?? data?.id;
}

export function toApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}T00:00:00`;
}

export function getDateKeyFromApiDate(dateText) {
  return String(dateText || '').slice(0, 10);
}

export function normalizeTodo(todo) {
  return {
    id: todo.todo_id ?? todo.todoId ?? todo.id,
    content: todo.content ?? '',
    date: todo.date ?? '',
    isChecked: Boolean(todo.is_checked ?? todo.isChecked),
    emoji: todo.emoji ?? '',
    member: todo.member ?? '',
  };
}

export async function registerMember({ username, password }) {
  const response = await apiClient.post('/api/members/register', {
    username,
    password,
  });

  return response.data;
}

export async function loginMember({ username, password }) {
  const response = await apiClient.post('/api/members/login', {
    username,
    password,
  });

  return response.data;
}

export async function fetchTodos(memberId) {
  const response = await apiClient.get(`/api/members/${memberId}/todos`);

  return response.data.map(normalizeTodo);
}

export async function fetchDailyTodos(memberId, date) {
  const response = await apiClient.get(`/api/members/${memberId}/todos/daily`, {
    params: {
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
  });

  return response.data.map(normalizeTodo);
}

export async function createTodo(memberId, { content, date }) {
  const response = await apiClient.post(`/api/members/${memberId}/todos`, {
    content,
    date: toApiDate(date),
  });

  return normalizeTodo(response.data);
}

export async function updateTodo(memberId, todoId, { content, date }) {
  const response = await apiClient.patch(`/api/members/${memberId}/todos/${todoId}`, {
    content,
    date,
  });

  return normalizeTodo(response.data);
}

export async function deleteTodo(memberId, todoId) {
  await apiClient.delete(`/api/members/${memberId}/todos/${todoId}`);
}

export async function reviewTodo(memberId, todoId, emoji) {
  const response = await apiClient.patch(`/api/members/${memberId}/todos/${todoId}/reviews`, {
    emoji,
  });

  return normalizeTodo(response.data);
}

export async function toggleTodoCheck(memberId, todoId) {
  const response = await apiClient.patch(`/api/members/${memberId}/todos/${todoId}/check`, {});

  return normalizeTodo(response.data);
}
