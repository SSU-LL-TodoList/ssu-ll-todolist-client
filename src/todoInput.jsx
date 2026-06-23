export default function TodoInput({ todoText, selectedDateLabel, onTodoTextChange, onAddTodo, disabled }) {
  return (
    <section className="flex h-full w-1/2 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold text-slate-900">할 일 입력</h2>
        <span className="text-sm font-semibold text-blue-600">{selectedDateLabel}</span>
      </div>

      <form className="mt-4 flex flex-1 flex-col" onSubmit={onAddTodo}>
        <label className="text-sm font-medium text-slate-700" htmlFor="todo-input">
          새 할 일
        </label>
        <textarea
          className="mt-2 flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          id="todo-input"
          placeholder="선택한 날짜에 할 일을 입력하세요"
          value={todoText}
          onChange={(event) => onTodoTextChange(event.target.value)}
          disabled={disabled}
        />
        <button
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          type="submit"
          disabled={disabled}
        >
          {disabled ? '저장 중...' : '추가'}
        </button>
      </form>
    </section>
  );
}
