import * as types from "../../actionsTypes/FolderActionsType";


export const addFolder = (payload) => ({
  type: types.CREATE_FOLDER,
  payload,
});
export const addFolders = (payload) => ({
  type: types.ADD_FOLDER,
  payload,
});
export const setLoading = (payload) => ({
  type: types.SET_LOADING,
  payload,
});

export const changeFolder =(payload)=>({
  type: types.CHANGE_FOLDER,
  payload,
});

export const removeFolder = (folderId) => ({
  type: types.REMOVE_FOLDER,
  payload: folderId,
});

export const moveFolder = (payload) => ({
  type: types.MOVE_FOLDER,
  payload,
});

export const renameFolder = (name , docId) => ({
  type: types.RENAME_FOLDER,
  payload : {name : name , docId : docId},
});

export const addToDeletedFolders = (payload) => ({
  type: types.ADD_TO_DELETED_FOLDERS,
  payload
});

export const goBackFolder = () => ({
  type: types.GO_BACK,
});

export const recoveryFolders = (payload) => ({
  type: types.RECOVERY_FOLDER,
  payload
});

