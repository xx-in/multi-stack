<script lang="ts">
  type Todo = { id: number; text: string; done: boolean };
  type Filter = 'all' | 'active' | 'done';

  let todos = $state<Todo[]>([
    { id: 1, text: '对比四种实现', done: false },
    { id: 2, text: '用 History 打开本页', done: true },
  ]);
  let draft = $state('');
  let filter = $state<Filter>('all');
  let nextId = 3;

  const visible = $derived(
    todos.filter((todo) => {
      if (filter === 'active') return !todo.done;
      if (filter === 'done') return todo.done;
      return true;
    }),
  );
  const remaining = $derived(todos.filter((todo) => !todo.done).length);
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'active', label: '未完成' },
    { id: 'done', label: '已完成' },
  ];

  function add(event: SubmitEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    todos = [...todos, { id: nextId, text, done: false }];
    nextId += 1;
    draft = '';
  }

  function toggle(id: number) {
    todos = todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
  }

  function remove(id: number) {
    todos = todos.filter((todo) => todo.id !== id);
  }

  function clearDone() {
    todos = todos.filter((todo) => !todo.done);
  }
</script>

<section
  data-todo-framework="svelte"
  class="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
>
  <header class="mb-3 flex items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      <h2 class="text-base font-semibold">待办</h2>
      <span
        class="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200"
        >Svelte</span
      >
    </div>
    <span data-todo-remaining class="text-sm text-zinc-500 dark:text-zinc-400"
      >剩余 {remaining}</span
    >
  </header>
  <form class="mb-3 flex gap-2" onsubmit={add}>
    <input
      data-todo-input
      bind:value={draft}
      placeholder="添加待办"
      autocomplete="off"
      class="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
    />
    <button
      data-todo-add
      type="submit"
      class="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      >添加</button
    >
  </form>
  <div class="mb-3 flex gap-2 text-sm">
    {#each filters as item (item.id)}
      <button
        type="button"
        data-todo-filter={item.id}
        aria-pressed={filter === item.id}
        class={filter === item.id
          ? 'rounded-full bg-zinc-900 px-2.5 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900'
          : 'rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}
        onclick={() => (filter = item.id)}
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#if visible.length === 0}
    <p
      data-todo-empty
      class="rounded-lg bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
    >
      没有待办
    </p>
  {:else}
    <ul class="space-y-2">
      {#each visible as todo (todo.id)}
        <li
          data-todo-item
          data-done={todo.done ? 'true' : 'false'}
          class="flex items-center gap-2 rounded-lg border border-zinc-100 px-2 py-1.5 dark:border-zinc-800"
        >
          <input
            data-todo-toggle
            type="checkbox"
            checked={todo.done}
            class="size-4"
            aria-label={`完成 ${todo.text}`}
            onchange={() => toggle(todo.id)}
          />
          <span
            data-todo-text
            class={todo.done
              ? 'min-w-0 flex-1 text-sm text-zinc-400 line-through'
              : 'min-w-0 flex-1 text-sm text-zinc-800 dark:text-zinc-200'}
          >
            {todo.text}
          </span>
          <button
            data-todo-delete
            type="button"
            class="text-sm text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            onclick={() => remove(todo.id)}
          >
            删除
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <button
    data-todo-clear
    type="button"
    disabled={remaining === todos.length}
    class="mt-3 self-start text-sm text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400"
    onclick={clearDone}
  >
    清除已完成
  </button>
</section>
