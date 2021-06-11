<template>
  <div>
    <h1>QuillEditor</h1>
    <quill-editor></quill-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuillEditor from '@/components/quill-editor/index.vue';
export default defineComponent({
  name: 'App',
  components: {
    QuillEditor
  },
  setup(){

  }
})
</script>

<style>

</style>
