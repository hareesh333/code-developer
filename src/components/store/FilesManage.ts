// store/FilesManage.ts
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { saveFoldersToStorage, loadFoldersFromStorage } from '../api/localStorageAPI';


export type Item = {
  itemid: string;
  name: string;
  description: string;
  type: string;
  folderid: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FolderType = "prompt" | "workflow" | "datasets";


export type FolderStructure = {
  folderid: string;
  name: string;
  items: Item[];
  createdAt: Date;
  category?: FolderType
  
};

export interface FilesManageStore {
  folders: FolderStructure[];
  addFolder: (name: string, category : FolderType) => void;
  addItem: (folderId: string, name: string, description: string, type: string) => void;
  removeItem: (itemId: string) => void;
  removeFolder: (folderId: string) => void;
  loadFromLocalStorage: () => void;
}

export const useFilesManageStore = create<FilesManageStore>((set) => ({
  folders: [],

  addFolder: (name: string, category: FolderType) =>
    set((state) => {
      const newFolders = [
        ...state.folders,
        { folderid: uuid(), name, items: [], createdAt: new Date(), category },
      ];
      saveFoldersToStorage(newFolders);
      return { folders: newFolders };
    }),

  addItem: (folderId, name, description, type) =>
    set((state) => {
        console.log(folderId, name, description, type);
      const updatedFolders = state.folders.map((folder) =>
        folder.folderid === folderId
          ? {
              ...folder,
              items: [
                ...folder.items,
                { itemid: uuid(), name, description, type, folderid: folderId },
              ],
            }
          : folder
      );
      saveFoldersToStorage(updatedFolders);
      return { folders: updatedFolders };
    }),

  removeItem: (itemId) =>
    set((state) => {
      const updatedFolders = state.folders.map((folder) => ({
        ...folder,
        items: folder.items.filter((item) => item.itemid !== itemId),
      }));
      saveFoldersToStorage(updatedFolders);
      return { folders: updatedFolders };
    }),

  removeFolder: (folderId) =>
    set((state) => {
      const updatedFolders = state.folders.filter((folder) => folder.folderid !== folderId);
      saveFoldersToStorage(updatedFolders);
      return { folders: updatedFolders };
    }),

  loadFromLocalStorage: () => {
    const loaded = loadFoldersFromStorage();
    console.log(loaded)
    set({ folders: loaded });
  },
}));