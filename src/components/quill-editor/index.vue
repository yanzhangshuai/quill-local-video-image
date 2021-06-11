<template>
    <div id="editor"></div>
</template>

<script lang="ts">
import { defineComponent, markRaw, onMounted } from 'vue';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import VideoUploader from './modules/video-uploader';
import ImageUploader from './modules/image-uploader';
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/videoUploader", VideoUploader);
export default defineComponent({
    setup() {

        const quill = markRaw<{
            value: Quill
        }>({
            value: null
        });

        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            ['color', 'background'],          // dropdown with defaults from theme
            ['font'],
            ['align'],
            ['image', 'video'],

            ['clean']                                         // remove formatting button
        ];

        const modules = {
            toolbar: toolbarOptions,
            videoUploader: {
                limit: 10 * 1024 * 1024,
                limitError: () => alert('超过传输限制'),
                upload: (file: File) => {
                    quill.value.enable(false);
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            quill.value.enable(true);
                            resolve(
                                "http://media.w3.org/2010/05/sintel/trailer.mp4"
                            );
                        }, 3500);
                    });
                },
            }, 
            imageUploader: {
                limit: 10 * 1024 * 1024,
                limitError: () => alert('超过传输限制'),
                upload: (file: File) => {
                    quill.value.enable(false);
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            quill.value.enable(true);
                            resolve(
                                "http://pic37.nipic.com/20140113/8800276_184927469000_2.png"
                            );
                        }, 3500);
                    });
                },
            }
        }

        onMounted(() => {
             quill.value = new Quill('#editor', {
                theme: 'snow',
                modules: modules
            });

        })
        return {}
    }
})
</script>

<style scoped>
</style>