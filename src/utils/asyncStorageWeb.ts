// utils/asyncStorageWeb.ts

export const setItem = async (key: string, value: string): Promise<void> => {
  localStorage.setItem(key, value);
};

export const getItem = async (key: string): Promise<string | null> => {
  return localStorage.getItem(key);
};

export const removeItem = async (key: string): Promise<void> => {
  localStorage.removeItem(key);
};

export const getAllKeys = async (): Promise<string[]> => {
  return Object.keys(localStorage);
};

export const multiGet = async (keys: string[]): Promise<[string, string | null][]> => {
  return keys.map((key) => [key, localStorage.getItem(key)]);
};

export const clear = async (): Promise<void> => {
  localStorage.clear();
};
