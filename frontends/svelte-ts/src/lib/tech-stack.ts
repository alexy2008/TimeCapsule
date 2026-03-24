import { writable } from 'svelte/store';
import { getHealthInfo } from './api';
import type { TechStack } from './types';

export const techStack = writable<TechStack | null>(null);
export const techStackLoading = writable(true);
export const techStackError = writable(false);

let loaded = false;

export async function loadTechStack() {
  if (loaded) {
    return;
  }

  loaded = true;

  try {
    const response = await getHealthInfo();
    techStack.set(response.data.techStack);
    techStackError.set(false);
  } catch {
    techStack.set(null);
    techStackError.set(true);
  } finally {
    techStackLoading.set(false);
  }
}
