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
  <div class="clock">
    <p class="clock-title">距离开启还有</p>
    <div class="units">
      {#each units as unit, i}
        <div class="unit-group">
          <div class="card">
            <span class="number">{pad(unit.value)}</span>
          </div>
          <span class="label">{unit.label}</span>
          {#if i < units.length - 1}
            <span class="colon">:</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .clock {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-6) var(--space-4);
    gap: var(--space-4);
  }

  .clock-title {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    letter-spacing: 0.05em;
    margin: 0;
  }

  .units {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .unit-group {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 72px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
  }

  .card::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: var(--color-border);
  }

  .number {
    font-size: 2rem;
    font-weight: var(--font-bold);
    font-variant-numeric: tabular-nums;
    color: var(--color-text);
    line-height: 1;
    z-index: 1;
  }

  .label {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
    align-self: flex-end;
    padding-bottom: var(--space-1);
  }

  .colon {
    font-size: 2rem;
    font-weight: var(--font-bold);
    color: var(--color-text-secondary);
    line-height: 1;
    align-self: flex-start;
    margin-top: 18px;
  }

  .unit-group:last-child .card {
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg-secondary));
  }

  .unit-group:last-child .number {
    color: var(--color-primary);
  }

  .expired-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4);
    color: var(--color-success);
    font-size: var(--text-base);
  }

  .expired-icon {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    .card {
      width: 52px;
      height: 60px;
    }
    .number {
      font-size: 1.5rem;
    }
  }
</style>
