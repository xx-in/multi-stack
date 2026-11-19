<!-- vue2 -->
<script>
export default {
  data() {
    return {
      todos: [
        { id: 1, text: '对比四种实现', done: false },
        { id: 2, text: '用 History 打开本页', done: true },
      ],
      draft: '',
      filter: 'all',
      nextId: 3,
      filters: [
        { id: 'all', label: '全部' },
        { id: 'active', label: '未完成' },
        { id: 'done', label: '已完成' },
      ],
    };
  },
  computed: {
    visible() {
      return this.todos.filter((todo) => {
        if (this.filter === 'active') return !todo.done;
        if (this.filter === 'done') return todo.done;
        return true;
      });
    },
    remaining() {
      return this.todos.filter((todo) => !todo.done).length;
    },
  },
  methods: {
    add() {
      const text = this.draft.trim();
      if (!text) return;
      this.todos.push({ id: this.nextId, text, done: false });
      this.nextId += 1;
      this.draft = '';
    },
    toggle(id) {
      const todo = this.todos.find((item) => item.id === id);
      if (todo) todo.done = !todo.done;
    },
    remove(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    clearDone() {
      this.todos = this.todos.filter((todo) => !todo.done);
    },
  },
};
</script>

<template>
  <section
    data-todo-framework="vue2"
    class="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
  >
    <header class="mb-3 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-semibold">待办</h2>
        <span
          class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          >Vue 2</span
        >
      </div>
      <span data-todo-remaining class="text-sm text-zinc-500 dark:text-zinc-400"
        >剩余 {{ remaining }}</span
      >
    </header>
    <form class="mb-3 flex gap-2" @submit.prevent="add">
      <input
        data-todo-input
        v-model="draft"
        placeholder="添加待办"
        autocomplete="off"
        class="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
      />
      <button
        data-todo-add
        type="submit"
        class="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        添加
      </button>
    </form>
    <div class="mb-3 flex gap-2 text-sm">
      <button
        v-for="item in filters"
        :key="item.id"
        type="button"
        :data-todo-filter="item.id"
        :aria-pressed="filter === item.id ? 'true' : 'false'"
        :class="
          filter === item.id
            ? 'rounded-full bg-zinc-900 px-2.5 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
        "
        @click="filter = item.id"
      >
        {{ item.label }}
      </button>
    </div>
    <p
      v-if="visible.length === 0"
      data-todo-empty
      class="rounded-lg bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
    >
      没有待办
    </p>
    <ul v-else class="space-y-2">
      <li
        v-for="todo in visible"
        :key="todo.id"
        data-todo-item
        :data-done="todo.done ? 'true' : 'false'"
        class="flex items-center gap-2 rounded-lg border border-zinc-100 px-2 py-1.5 dark:border-zinc-800"
      >
        <input
          data-todo-toggle
          type="checkbox"
          :checked="todo.done"
          class="size-4"
          :aria-label="'完成 ' + todo.text"
          @change="toggle(todo.id)"
        />
        <span
          data-todo-text
          :class="
            todo.done
              ? 'min-w-0 flex-1 text-sm text-zinc-400 line-through'
              : 'min-w-0 flex-1 text-sm text-zinc-800 dark:text-zinc-200'
          "
        >
          {{ todo.text }}
        </span>
        <button
          data-todo-delete
          type="button"
          class="text-sm text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
          @click="remove(todo.id)"
        >
          删除
        </button>
      </li>
    </ul>
    <button
      data-todo-clear
      type="button"
      :disabled="remaining === todos.length"
      class="mt-3 self-start text-sm text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400"
      @click="clearDone"
    >
      清除已完成
    </button>
  </section>
</template>
