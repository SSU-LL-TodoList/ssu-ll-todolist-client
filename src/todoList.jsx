import { useState } from 'react';

export default function TodoList({
  todos,
  selectedDateLabel,
  isLoading,
  isSaving,
  onDeleteTodo,
  onReviewTodo,
  onToggleTodo,
  onUpdateTodo,
}) {
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [reviewValues, setReviewValues] = useState({});

  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditingContent(todo.content);
  };

  const handleSubmitEdit = async (todo) => {
    const nextContent = editingContent.trim();

    if (!nextContent) {
      return;
    }

    await onUpdateTodo(todo, nextContent);
    setEditingTodoId(null);
    setEditingContent('');
  };

  const handleReviewChange = (todoId, value) => {
    setReviewValues((currentValues) => ({
      ...currentValues,
      [todoId]: value,
    }));
  };

  const handleSubmitReview = async (todo) => {
    const nextReview = (reviewValues[todo.id] ?? todo.emoji ?? '').trim();

    await onReviewTodo(todo.id, nextReview);
  };

  return (
    <section className="flex h-full w-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold text-slate-900">할 일 목록</h2>
        <span className="text-sm font-semibold text-blue-600">{selectedDateLabel}</span>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-500">
            불러오는 중입니다.
          </div>
        ) : todos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-500">
            아직 등록된 할 일이 없습니다.
          </div>
        ) : (
          todos.map((todo) => (
            <div
              className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800"
              key={todo.id}
            >
              <div className="flex items-center gap-3">
                <input
                  className="h-5 w-5 accent-blue-600"
                  type="checkbox"
                  checked={todo.isChecked}
                  disabled={isSaving}
                  onChange={() => onToggleTodo(todo.id)}
                />

                {editingTodoId === todo.id ? (
                  <input
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                    disabled={isSaving}
                  />
                ) : (
                  <span className={`min-w-0 flex-1 ${todo.isChecked ? 'text-slate-400 line-through' : ''}`}>
                    {todo.content}
                  </span>
                )}

                {todo.emoji && (
                  <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {todo.emoji}
                  </span>
                )}

                {editingTodoId === todo.id ? (
                  <>
                    <button
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSubmitEdit(todo)}
                    >
                      저장
                    </button>
                    <button
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      type="button"
                      disabled={isSaving}
                      onClick={() => setEditingTodoId(null)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleStartEdit(todo)}
                    >
                      수정
                    </button>
                    <button
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      type="button"
                      disabled={isSaving}
                      onClick={() => onDeleteTodo(todo.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 pl-8">
                <input
                  className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="리뷰를 입력하세요"
                  value={reviewValues[todo.id] ?? todo.emoji ?? ''}
                  onChange={(event) => handleReviewChange(todo.id, event.target.value)}
                  disabled={isSaving}
                />
                <button
                  className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSubmitReview(todo)}
                >
                  리뷰
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
