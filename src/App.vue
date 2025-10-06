<template>
  <main class="p-6 text-gray-100 bg-gray-900 min-h-screen">
    <h1 class="text-3xl font-bold mb-4">Vue Project Creator</h1>

    <div class="space-y-3">
      <input v-model="root" placeholder="Root folder" class="w-full p-2 rounded text-black" />
      <input v-model="name" placeholder="Project name" class="w-full p-2 rounded text-black" />
      <input v-model="features" placeholder="--typescript --router --pinia" class="w-full p-2 rounded text-black" />
      <button
        @click="create"
        class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
      >
        Create Project
      </button>
    </div>

    <pre class="mt-6 bg-gray-800 p-4 rounded overflow-y-auto h-64">{{ logs }}</pre>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

const root = ref("");
const name = ref("");
const features = ref("--typescript --router --pinia");
const logs = ref("");

async function create() {
  logs.value = "🚀 Creating project...\n";
  await window.electronAPI.createProject({ root: root.value, name: name.value, features: features.value });
}

onMounted(() => {
  window.electronAPI.onLogUpdate((msg) => {
    logs.value += msg;
  });
});
</script>