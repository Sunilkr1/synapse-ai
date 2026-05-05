import { create } from 'zustand';
import { useAuthStore as srcAuthStore } from '../src/stores/authStore';
// Re-export from the canonical store location
export { srcAuthStore as useAuthStore };
