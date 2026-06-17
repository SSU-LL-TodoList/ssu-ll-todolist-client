export default function TodoList({ todos, selectedDateLabel }) {
  return (
    <section className="flex h-full w-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold text-slate-900">할 일 목록</h2>
        <span className="text-sm font-semibold text-blue-600">{selectedDateLabel}</span>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-500">
            아직 등록된 할 일이 없습니다.
          </div>
        ) : (
          todos.map((todo, index) => (
            <div
              className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800"
              key={`${todo}-${index}`}
            >
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {index + 1}
              </span>
              <span>{todo}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
