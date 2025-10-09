<template>
  <div class="p-6 max-w-lg mx-auto min-h-screen flex flex-col justify-between">
    <div>
      <h1 class="text-2xl font-bold mb-6 text-center">Vue Project Creator</h1>

      <!-- Step 1: Select Folder -->
      <div v-if="step === 1">
        <h2 class="text-xl mb-3">Select Root Folder</h2>
        <div class="flex items-center gap-3 mb-4">
          <button
            @click="selectFolder"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📁Select Folder
          </button>
          <span v-if="folderPath" class="text-sm truncate max-w-[250px]">{{ folderPath }}</span>
        </div>
      </div>

      <!-- Step 2: Project Name -->
      <div v-else-if="step === 2">
        <h2 class="text-xl mb-3">Enter Project Name</h2>
        <input
          v-model="projectName"
          type="text"
          placeholder="e.g. my-vue-app"
          class="border px-3 py-2 rounded-lg w-full"
        />
      </div>

      <!-- Step 3 placeholder -->
      <div v-else-if="step === 3">
        <div class="w-full max-w-md mb-4">
          <label class="block mb-1 font-semibold">Select Features</label>
          <div class="flex flex-col gap-2 bg-white p-3 rounded border">
            <label v-for="feature in features" :key="feature.key" class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="selectedFeatures"
                :value="feature.key"
              />
              <span>{{ feature.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 🧭 Navigation Footer -->
    <div class="flex justify-between items-center border-t pt-4 mt-8">
      <button
        v-if="step > 1"
        @click="prevStep"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        ⬅️ Back
      </button>
      <div class="ml-auto">
        <button
          v-if="step < maxStep"
          :disabled="!canGoNext"
          @click="nextStep"
          class="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next ➡️
        </button>
        <button
          v-else
          class="bg-blue-600 text-white px-4 py-2 rounded-lg"
          @click="finish"
        >
          ✅ Finish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const step = ref(1);
const maxStep = 3;
const folderPath = ref("");
const projectName = ref("");

const features = [
  { key: "typescript", label: "TypeScript" },
  { key: "router", label: "Vue Router" },
  { key: "pinia", label: "Pinia" },
  { key: "vitest", label: "Vitest (Unit Test)" },
  { key: "eslint", label: "ESLint" },
];

// folder picker
async function selectFolder() {
  const selected = await window.electronAPI.browseFolder();
  if (selected) folderPath.value = selected;
}

// control buttons
const canGoNext = computed(() => {
  if (step.value === 1) return folderPath.value !== "";
  if (step.value === 2) return projectName.value.trim().length > 0;
  return true;
});

function nextStep() {
  if (step.value < maxStep) step.value++;
}
function prevStep() {
  if (step.value > 1) step.value--;
}

function finish() {
  console.log("Selected folder:", folderPath.value);
  console.log("Project name:", projectName.value);
  // later we'll trigger npm create vue@latest here 👷
}
</script>

<style scoped>
input:focus {
  outline: 2px solid #3b82f6;
}
</style>
