<template>
  <div class="search-container">
    <input v-model="query" @input="highlightMatches" placeholder="Поиск..." />
    <div class="navigation-buttons">
      <button @click="previousMatch">Назад</button>
      <button @click="nextMatch">Далее</button>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const query = ref("");
const matches = ref<NodeListOf<Element> | null>(null);
const currentIndex = ref(0);

const highlightMatches = () => {
  if (!query.value) {
    clearHighlights();
    return;
  }

  const content = document.querySelector(".content");
  if (!content) return;

  clearHighlights();

  const regExp = new RegExp(query.value, "gi");
  content.innerHTML = content.innerHTML.replace(
    regExp,
    (match) => `<mark class="highlight">${match}</mark>`
  );

  matches.value = document.querySelectorAll(".highlight");
  currentIndex.value = 0;

  if (matches.value.length) {
    scrollToMatch(currentIndex.value);
  }
};

const clearHighlights = () => {
  const content = document.querySelector(".content");
  if (!content) return;

  content.innerHTML = content.innerHTML.replace(/<\/?mark[^>]*>/gi, "");
};

const scrollToMatch = (index: number) => {
  if (!matches.value || !matches.value.length) return;

  matches.value[index].scrollIntoView({ behavior: "smooth", block: "center" });
};

const nextMatch = () => {
  if (!matches.value || !matches.value.length) return;

  currentIndex.value = (currentIndex.value + 1) % matches.value.length;
  scrollToMatch(currentIndex.value);
};

const previousMatch = () => {
  if (!matches.value || !matches.value.length) return;

  currentIndex.value =
    (currentIndex.value - 1 + matches.value.length) % matches.value.length;
  scrollToMatch(currentIndex.value);
};

watch(
  () => query.value,
  () => highlightMatches
);
</script>

<style scoped>
.search-container {
  position: fixed;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navigation-buttons {
  margin-top: 10px;
}

.navigation-buttons button {
  margin: 0 5px;
}

.highlight {
  background-color: yellow;
}
</style>
