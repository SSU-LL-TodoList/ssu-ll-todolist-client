import { useCallback, useEffect, useState } from 'react';
import Calendar from './calendar.jsx';
import TodoInput from './todoInput.jsx';
import TodoList from './todoList.jsx';
import {
  createTodo,
  deleteTodo,
  fetchDailyTodos,
  fetchTodos,
  getDateKeyFromApiDate,
  getErrorMessage,
  reviewTodo,
  toggleTodoCheck,
  updateTodo,
} from './api.js';

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function groupTodosByDate(todos) {
  return todos.reduce((todosByDate, todo) => {
    const dateKey = getDateKeyFromApiDate(todo.date);

    if (!dateKey) {
      return todosByDate;
    }

    return {
      ...todosByDate,
      [dateKey]: [
        ...(todosByDate[dateKey] ?? []),
        todo,
      ],
    };
  }, {});
}

export default function Second({ memberId, onLogout }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todoText, setTodoText] = useState('');
  const [todosByDate, setTodosByDate] = useState({});
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const selectedDateKey = getDateKey(selectedDate);
  const selectedDateLabel = getDateLabel(selectedDate);

  const loadAllTodos = useCallback(async () => {
    const todos = await fetchTodos(memberId);
    setTodosByDate(groupTodosByDate(todos));
  }, [memberId]);

  const loadSelectedTodos = useCallback(async (date) => {
    const todos = await fetchDailyTodos(memberId, date);
    setSelectedTodos(todos);
  }, [memberId]);

  const refreshTodos = useCallback(async (date) => {
    await Promise.all([
      loadAllTodos(),
      loadSelectedTodos(date),
    ]);
  }, [loadAllTodos, loadSelectedTodos]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        await refreshTodos(selectedDate);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, '투두 목록을 불러오지 못했습니다.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [memberId, refreshTodos, selectedDate, selectedDateKey]);

  const runTodoAction = async (action, fallbackMessage) => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      await action();
      await refreshTodos(selectedDate);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, fallbackMessage));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTodo = async (event) => {
    event.preventDefault();

    const nextTodo = todoText.trim();
    if (!nextTodo) {
      return;
    }

    await runTodoAction(async () => {
      await createTodo(memberId, {
        content: nextTodo,
        date: selectedDate,
      });
      setTodoText('');
    }, '투두를 추가하지 못했습니다.');
  };

  const handleUpdateTodo = async (todo, content) => {
    await runTodoAction(async () => {
      await updateTodo(memberId, todo.id, {
        content,
        date: todo.date,
      });
    }, '투두를 수정하지 못했습니다.');
  };

  const handleDeleteTodo = async (todoId) => {
    await runTodoAction(async () => {
      await deleteTodo(memberId, todoId);
    }, '투두를 삭제하지 못했습니다.');
  };

  const handleReviewTodo = async (todoId, emoji) => {
    await runTodoAction(async () => {
      await reviewTodo(memberId, todoId, emoji);
    }, '투두 리뷰를 저장하지 못했습니다.');
  };

  const handleToggleTodo = async (todoId) => {
    await runTodoAction(async () => {
      await toggleTodoCheck(memberId, todoId);
    }, '투두 완료 상태를 변경하지 못했습니다.');
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-slate-100">
      <div className="flex h-[95%] w-[90%] flex-col gap-4">
        <div className="flex w-full justify-end">
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            type="button"
            onClick={onLogout}
          >
            로그아웃
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5">
          <div className="flex h-1/2 w-full gap-5">
            <Calendar
              selectedDate={selectedDate}
              todosByDate={todosByDate}
              onSelectDate={setSelectedDate}
            />
            <TodoInput
              todoText={todoText}
              selectedDateLabel={selectedDateLabel}
              onTodoTextChange={setTodoText}
              onAddTodo={handleAddTodo}
              disabled={isSaving}
            />
          </div>

          {errorMessage && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="flex h-1/2 w-full">
            <TodoList
              todos={selectedTodos}
              selectedDateLabel={selectedDateLabel}
              isLoading={isLoading}
              isSaving={isSaving}
              onDeleteTodo={handleDeleteTodo}
              onReviewTodo={handleReviewTodo}
              onToggleTodo={handleToggleTodo}
              onUpdateTodo={handleUpdateTodo}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
