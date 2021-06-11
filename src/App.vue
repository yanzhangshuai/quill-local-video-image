<template>
  <div>
    <h1>QuillEditor</h1>
    <quill-editor v-model:value="quillValue"></quill-editor>
    <div v-html="quillValue"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import QuillEditor from '@/components/quill-editor/index.vue';
export default defineComponent({
  name: 'App',
  components: {
    QuillEditor
  },
  setup() {
    const quillValue = ref('');



    const onClick = () => {
      console.log(quillValue.value);
      
    }

    return { quillValue, onClick }

  }
})
</script>

<style>
</style>
