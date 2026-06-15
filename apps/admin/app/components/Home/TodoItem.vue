<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <input
        :checked="todo.done"
        class="toggle"
        type="checkbox"
        @change="$emit('toggleTodo', todo)"
      >
      <label @dblclick="startEdit" v-text="todo.text" />
      <button class="destroy" @click="$emit('deleteTodo', todo)" />
    </div>
    <input
      v-show="editing"
      ref="editInput"
      :value="todo.text"
      class="edit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    >
  </li>
</template>

<script setup lang="ts">
interface TodoItem {
  text: string
  done: boolean
}

const props = defineProps<{ todo: TodoItem }>()
const emit = defineEmits<{
  (e: 'toggleTodo', t: TodoItem): void
  (e: 'deleteTodo', t: TodoItem): void
  (e: 'editTodo', payload: { todo: TodoItem; value: string }): void
}>()

const editing = ref(false)
const editInput = ref<HTMLInputElement | null>(null)

function startEdit() {
  editing.value = true
  nextTick(() => editInput.value?.focus())
}

function doneEdit(e: Event) {
  const value = (e.target as HTMLInputElement).value.trim()
  if (!value) {
    emit('deleteTodo', props.todo)
  } else if (editing.value) {
    emit('editTodo', { todo: props.todo, value })
    editing.value = false
  }
}

function cancelEdit(e: Event) {
  (e.target as HTMLInputElement).value = props.todo.text
  editing.value = false
}
</script>
