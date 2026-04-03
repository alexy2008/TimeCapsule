import { getHealthInfo } from './api';
import type { TechStack } from './types';

const state = $state({
  techStack: null as TechStack | null,
  loading: true,
  error: false,
});

let loaded = false;
let pendingRequest: Promise<void> | null = null;

export const techStackState = state;

export async function ensureTechStackLoaded(force = false) {
  if (pendingRequest) {
    return pendingRequest;
  }

  if (!force && loaded) {
    return;
  }

  state.loading = true;
  state.error = false;

  pendingRequest = (async () => {
    try {
      const response = await getHealthInfo();
      state.techStack = response.data.techStack;
      state.error = false;
      loaded = true;
    } catch {
      state.techStack = null;
      state.error = true;
      loaded = false;
    } finally {
      state.loading = false;
      pendingRequest = null;
    }
  })();

  return pendingRequest;
}

export function resetTechStackState() {
  state.techStack = null;
  state.loading = true;
  state.error = false;
  loaded = false;
  pendingRequest = null;
}
