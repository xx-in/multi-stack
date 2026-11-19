import { useState, type FormEvent } from 'react';

type Todo = { id: number; text: string; done: boolean };
type Filter = 'all' | 'active' | 'done';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'active', label: '未完成' },
  { id: 'done', label: '已完成' },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '对比四种实现', done: false },
    { id: 2, text: '用 History 打开本页', done: true },
  ]);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [nextId, setNextId] = useState(3);

  const visible = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
    return true;
  });
  const remaining = todos.filter((todo) => !todo.done).length;

  function add(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((items) => [...items, { id: nextId, text, done: false }]);
    setNextId((id) => id + 1);
    setDraft('');
  }

  function toggle(id: number) {
    setTodos((items) =>
      items.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    );
  }

  function remove(id: number) {
    setTodos((items) => items.filter((todo) => todo.id !== id));
  }

  function clearDone() {
    setTodos((items) => items.filter((todo) => !todo.done));
  }

  return (
    <section
      data-todo-framework="react"
      className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">待办</h2>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">
            React
          </span>
        </div>
        <span data-todo-remaining className="text-sm text-zinc-500 dark:text-zinc-400">
          剩余 {remaining}
        </span>
      </header>
      <form className="mb-3 flex gap-2" onSubmit={add}>
        <input
          data-todo-input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="添加待办"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        />
        <button
          data-todo-add
          type="submit"
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          添加
        </button>
      </form>
      <div className="mb-3 flex gap-2 text-sm">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            data-todo-filter={item.id}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={
              filter === item.id
                ? 'rounded-full bg-zinc-900 px-2.5 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p
          data-todo-empty
          className="rounded-lg bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        >
          没有待办
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              data-todo-item
              data-done={todo.done ? 'true' : 'false'}
              className="flex items-center gap-2 rounded-lg border border-zinc-100 px-2 py-1.5 dark:border-zinc-800"
            >
              <input
                data-todo-toggle
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
                className="size-4"
                aria-label={`完成 ${todo.text}`}
              />
              <span
                data-todo-text
                className={
                  todo.done
                    ? 'min-w-0 flex-1 text-sm text-zinc-400 line-through'
                    : 'min-w-0 flex-1 text-sm text-zinc-800 dark:text-zinc-200'
                }
              >
                {todo.text}
              </span>
              <button
                data-todo-delete
                type="button"
                onClick={() => remove(todo.id)}
                className="text-sm text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        data-todo-clear
        type="button"
        onClick={clearDone}
        disabled={remaining === todos.length}
        className="mt-3 self-start text-sm text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400"
      >
        清除已完成
      </button>
    </section>
  );
}
