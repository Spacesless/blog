<template>
  <section class="todoapp">
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo">
    </header>
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll(!allChecked)">
      <label for="toggle-all" />
      <ul class="todo-list">
        <HomeTodoItem
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggle-todo="toggleTodo"
          @edit-todo="editTodo"
          @delete-todo="deleteTodo"
        />
      </ul>
    </section>
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining === 1 ? 'item' : 'items' }} left
      </span>
      <ul class="filters">
        <li v-for="key in (Object.keys(filters) as Visibility[])" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">
            {{ key.charAt(0).toUpperCase() + key.slice(1) }}
          </a>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script setup lang="ts">
interface TodoItem {
  text: string
  done: boolean
}
type Visibility = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todos'
const filters: Record<Visibility, (todos: TodoItem[]) => TodoItem[]> = {
  all: list => list,
  active: list => list.filter(t => !t.done),
  completed: list => list.filter(t => t.done),
}
const defaultList: TodoItem[] = [
  { text: '编写文章', done: false },
  { text: '更新追番', done: false },
]

const visibility = ref<Visibility>('all')
const todos = ref<TodoItem[]>([])

onMounted(() => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    todos.value = cached ? JSON.parse(cached) : defaultList
  } catch {
    todos.value = defaultList
  }
})

const allChecked = computed(() => todos.value.every(t => t.done))
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => todos.value.filter(t => !t.done).length)

function setLocalStorage() {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

function addTodo(e: KeyboardEvent) {
  const target = e.target as HTMLInputElement
  const text = target.value
  if (text.trim()) {
    todos.value.push({ text, done: false })
    setLocalStorage()
  }
  target.value = ''
}

function toggleTodo(t: TodoItem) {
  t.done = !t.done
  setLocalStorage()
}

function deleteTodo(t: TodoItem) {
  const i = todos.value.indexOf(t)
  if (i >= 0) todos.value.splice(i, 1)
  setLocalStorage()
}

function editTodo({ todo, value }: { todo: TodoItem; value: string }) {
  todo.text = value
  setLocalStorage()
}

function toggleAll(done: boolean) {
  todos.value.forEach(t => (t.done = done))
  setLocalStorage()
}
</script>

<style lang="scss" scoped>
.todoapp {
  min-width: 230px;
  margin: 0 auto;
  background: #FFFFFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header {
    padding: 16px;
    border-bottom: 1px solid #EEEEEE;
  }

  .new-todo {
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    outline: none;
  }

  .main {
    min-height: 330px;
    padding: 8px 16px;

    .toggle-all,
    label[for='toggle-all'] {
      display: none;
    }
  }

  .todo-list {
    padding: 0;
    margin: 0;
    list-style: none;

    :deep(.todo) {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #F0F0F0;

      .view {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      &.completed label {
        color: #999999;
        text-decoration: line-through;
      }

      .destroy {
        margin-left: auto;
        color: #FF4D4F;
        cursor: pointer;
        background: transparent;
        border: 0;
        opacity: 0.6;

        &::after {
          content: '×';
        }
      }

      .edit {
        flex: 1;
        padding: 4px 8px;
        font-size: 14px;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    font-size: 12px;
    color: #666666;
    border-top: 1px solid #EEEEEE;

    .filters {
      display: flex;
      gap: 6px;
      padding: 0;
      margin: 0;
      list-style: none;

      a {
        padding: 2px 6px;
        cursor: pointer;
        border: 1px solid transparent;
        border-radius: 3px;

        &.selected {
          border-color: #409EFF;
        }
      }
    }
  }
}
</style>
