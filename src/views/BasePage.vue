<template>
  <div>
    <SideBar />
    <div class="content">
      <LogCard v-for="log in wampStore.filteredLogs" v-bind="log" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from "../components/SideBar.vue";
import LogCard from "../components/LogCard.vue";
import { useWampStore } from "../store/wampStore";
import { useRouter } from "vue-router";
import { useWampConnected } from "../hooks/useWampConnected";

const router = useRouter();

const wampStore = useWampStore();

useWampConnected(() => {
  wampStore
    .authToken()
    ?.then((response) => {
      localStorage.setItem("token", response.Token);
      wampStore.startHeartbeat();
      wampStore.subscribeToLogs();
    })
    .catch(() => {
      router.push("/login");
    });
});
</script>

<style scoped></style>
