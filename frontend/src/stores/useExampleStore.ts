import { create } from 'zustand';
import { AIResponse } from '../types/ai';
import { axiosInstance } from '../api/axiosConfig';

interface ExampleState {
  data: AIResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchExampleData: () => Promise<void>;
}

const useExampleStore = create<ExampleState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchExampleData: async () => {
    set({ isLoading: true, error: null });
    try {
      const resp = await axiosInstance.get<AIResponse>('/api/v1/example-hello');
      set({ data: resp.data, isLoading: false });
    } catch (err: any) {
      const message = err?.response?.data?.detail || err.message || 'Unknown error';
      set({ error: String(message), isLoading: false });
    }
  },
}));

export default useExampleStore;
