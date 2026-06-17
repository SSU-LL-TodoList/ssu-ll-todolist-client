import { useState } from 'react';

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function Calendar({ selectedDate, todosByDate, onSelectDate }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const days = [
    ...Array.from({ length: firstDay }, () => ''),
    ...Array.from({ length: lastDate }, (_, index) => String(index + 1)),
  ];
  const calendarDays = [
    ...days,
    ...Array.from({ length: 42 - days.length }, () => ''),
  ];

  const handlePrevMonth = () => {
    setViewDate((currentDate) => (
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    ));
  };

  const handleNextMonth = () => {
    setViewDate((currentDate) => (
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    ));
  };

  const handleToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const handleSelectDay = (day) => {
    onSelectDate(new Date(year, month, Number(day)));
  };

  return (
    <section className="flex h-full w-1/2 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          type="button"
          onClick={handlePrevMonth}
        >
          이전
        </button>
        <h2 className="text-xl font-bold text-slate-900">
          {year}년 {month + 1}월
        </h2>
        <button
          className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          type="button"
          onClick={handleNextMonth}
        >
          다음
        </button>
      </div>

      <button
        className="mt-3 self-center rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        type="button"
        onClick={handleToday}
      >
        오늘
      </button>

      <div className="mt-4 flex w-full">
        {weekdays.map((weekday, index) => (
          <div
            className={`w-[14.285%] text-center text-sm font-semibold ${
              index === 0
                ? 'text-red-500'
                : index === 6
                  ? 'text-blue-500'
                  : 'text-slate-500'
            }`}
            key={weekday}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-wrap">
        {calendarDays.map((day, index) => {
          const dayDate = day ? new Date(year, month, Number(day)) : null;
          const dayKey = dayDate ? getDateKey(dayDate) : '';
          const isSelectedDate = dayDate && getDateKey(dayDate) === getDateKey(selectedDate);
          const isToday = isCurrentMonth && Number(day) === today.getDate();
          const hasTodos = dayKey && (todosByDate[dayKey]?.length ?? 0) > 0;
          const dayOfWeek = index % 7;
          const weekendTextColor = dayOfWeek === 0
            ? 'text-red-500'
            : dayOfWeek === 6
              ? 'text-blue-500'
              : 'text-slate-700';

          return (
            <div className="flex h-[16.666%] w-[14.285%] items-center justify-center p-1" key={`${day}-${index}`}>
              {day && (
                <button
                  className={`flex h-full w-9 flex-col items-center justify-center rounded-md text-sm font-medium transition ${
                    isSelectedDate
                      ? 'bg-blue-600 text-white'
                      : `${weekendTextColor} hover:bg-slate-100`
                  } ${isToday && !isSelectedDate ? 'border border-blue-300' : ''}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                >
                  <span>{day}</span>
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                      hasTodos
                        ? isSelectedDate
                          ? 'bg-white'
                          : 'bg-blue-500'
                        : 'bg-transparent'
                    }`}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
