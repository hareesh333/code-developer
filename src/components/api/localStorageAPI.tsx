// utils/localStorageAPI.ts
import { FolderStructure } from "../store/FilesManage";

const STORAGE_KEY = "user-files";
const USER_ID = "user_123"; // Replace with real auth later

export function loadFoldersFromStorage(): FolderStructure[] {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}-${USER_ID}`);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load from localStorage:", err);
    return [];
  }
}

export function saveFoldersToStorage(folders: FolderStructure[]) {
  try {
    localStorage.setItem(`${STORAGE_KEY}-${USER_ID}`, JSON.stringify(folders));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}
