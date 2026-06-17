import { useState } from 'react';
import Calendar from './calendar.jsx';
import TodoInput from './todoInput.jsx';
import TodoList from './todoList.jsx';

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function Second({ onLogout }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todoText, setTodoText] = useState('');
  const [todosByDate, setTodosByDate] = useState({});
  const selectedDateKey = getDateKey(selectedDate);
  const selectedTodos = todosByDate[selectedDateKey] ?? [];
  const selectedDateLabel = getDateLabel(selectedDate);

  const handleAddTodo = (event) => {
    event.preventDefault();

    const nextTodo = todoText.trim();
    if (!nextTodo) {
      return;
    }

    setTodosByDate((currentTodosByDate) => ({
      ...currentTodosByDate,
      [selectedDateKey]: [
        ...(currentTodosByDate[selectedDateKey] ?? []),
        nextTodo,
      ],
    }));
    setTodoText('');
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
            />
          </div>

          <div className="flex h-1/2 w-full">
            <TodoList todos={selectedTodos} selectedDateLabel={selectedDateLabel} />
          </div>
        </div>
      </div>
    </main>
  );
}
