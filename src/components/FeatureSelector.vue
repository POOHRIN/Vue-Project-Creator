<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Select Features</h2>
    <div class="flex flex-col gap-2">
      <label v-for="feature in features" :key="feature.key" class="flex items-center gap-2">
        <input
          type="checkbox"
          v-model="selected"
          :value="feature.key"
        />
        <span>{{ feature.label }}</span>
      </label>
    </div>

    <button
      @click="confirmSelection"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Create Project
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const features = [
  { key: "typescript", label: "TypeScript" },
  { key: "router", label: "Vue Router" },
  { key: "pinia", label: "Pinia" },
  { key: "vitest", label: "Vitest (Unit Test)" },
  { key: "eslint", label: "ESLint" },
];

const selected = ref([]);

const confirmSelection = () => {
  window.electronAPI.createProject({
    name: "my-vue-app",
    root: "C:/Projects", // you’ll get this from folder picker later
    features: selected.value,
  });
};
</script>