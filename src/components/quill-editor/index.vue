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
    props:{
        value: {
            type: String,
            default: ''
        }
    },
    emits: {
        'update:value': (value: string) => value
    },
    setup(props, { emit }) {

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
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],         
            [{ 'direction': 'rtl' }],                        

            [{ 'size': ['small', false, 'large', 'huge'] }], 
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            ['color', 'background'],         
            ['font'],
            ['align'],
            ['image', 'video'],

            ['clean']                                     
        ];

        const modules = {
            toolbar: toolbarOptions,
            videoUploader: {
                limit: 10 * 1024 * 1024,
                limitError: () => alert('超过传输限制'),
                upload: (file: File) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(
                                "http://media.w3.org/2010/05/sintel/trailer.mp4"
                            );
                        }, 5500);
                    });
                },
            },
            imageUploader: {
                limit: 10 * 1024 * 1024,
                limitError: () => alert('超过传输限制'),
                upload: (file: File) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(
                                "https://avatars.githubusercontent.com/u/31086862?s=60&v=4"
                            );
                        }, 9500);
                    });
                },
            }
        }

        onMounted(() => {
            quill.value = new Quill('#editor', {
                theme: 'snow',
                modules: modules
            });

            quill.value.root.innerHTML = props.value || '';

            quill.value.on('text-change', () => {
                const html = quill.value.root.innerHTML;
                emit('update:value', html);
            })

        });

        return {}
    }
})
</script>

<style scoped>
</style>