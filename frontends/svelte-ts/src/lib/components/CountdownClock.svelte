<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let targetIso: string;
  const dispatch = createEventDispatcher<{ expired: void }>();

  let timeVar = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  let timer: ReturnType<typeof setInterval>;
  let expiredTimer: ReturnType<typeof setTimeout>;

  function calc() {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) {
      if (!timeVar.expired) {
        timeVar = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        expiredTimer = setTimeout(() => dispatch('expired'), 3000);
      }
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    timeVar = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      expired: false,
    };
  }

  onMount(() => {
    calc();
    if (!timeVar.expired) {
      timer = setInterval(calc, 1000);
    }
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
    if (expiredTimer) clearTimeout(expiredTimer);
  });

  function pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  $: units = [
    { value: timeVar.days,    label: '天' },
    { value: timeVar.hours,   label: '时' },
    { value: timeVar.minutes, label: '分' },
    { value: timeVar.seconds, label: '秒' },
  ];
</script>

{#if timeVar.expired}
  <div class="expired-msg">
    <span class="expired-icon">🎉</span>
    <span>时间已到，胶囊即将开启…</span>
  </div>
{:else}
  <div class="countdown-display">
    <div class="countdown-ring"></div>
    <div class="countdown-text">
      {#each units as unit, i}
        <div class="time-block">
          <span class="mono-font num {i === 3 ? 'glow-text' : ''}">{pad(unit.value)}</span>
          <span class="unit">{unit.label}</span>
        </div>
        {#if i < units.length - 1}
          <span class="colon">:</span>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
  .expired-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    color: var(--green-neon);
    font-size: 1rem;
  }

  .expired-icon {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    .time-block {
      width: 52px;
      min-width: 52px;
    }
  }
</style>
