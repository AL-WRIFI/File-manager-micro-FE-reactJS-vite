import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faArrowRotateRight, faCopy, faScissors, faTrashCan, faAlignRight, faPaste, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteFile ,softDeleteFile , recoveryFile , MoveFile , pasteFile } from "Files_MFE/actions";
import { deleteFolder ,softDeleteFolder , recoveryFolder ,MoveFolder , pasetFolder } from "Folders_MFE/actions";
import { setSelectItemsMode , clearSelectedItems } from "../../Actions/SelectedItemsActions/ActionsSelectedItemsReducer";
import { addActionBuffer , addItemsToBuffer ,  clearBuffer } from "../../Actions/BufferActions/ActionsBufferReducer";

// import { checkAlreadyExists } from '../../SharedActions/ChecKAlreadyExists';

const DropdownMenu = () => {

    const { isLoading,childFolders,childFiles,
    currentFolder,itemsBuffer,currentFolderData,
    selectItemsMode ,actionBuffer,userDeletedFiles,
    userDeletedFolders , selectedItems} = useSelector((state)=>({

        isLoading : state.Folders.isLoading, 
        currentFolder : state.Folders.currentFolder,
        itemsBuffer: state.Buffer.itemsBuffer,
        actionBuffer: state.Buffer.action,
        selectedItems: state.SelectedItems.selectedItems,
        selectItemsMode : state.SelectedItems.selectItemsMode,
        userDeletedFiles: state.Files.userDeletedFiles,
        userDeletedFolders: state.Folders.userDeletedFolders,

        currentFolderData : state.Folders.userFolders.find(
            (folder)=> folder.docId === state.Folders.currentFolder),
        childFolders : state.Folders.userFolders.filter(
            (folder)=> (folder.data.parent === state.Folders.currentFolder)),
        childFiles : state.Files.userFiles.filter(
            (file)=> (file.data.parent === state.Folders.currentFolder)),     
    }));

    const dispatch = useDispatch();

    const getTypeActions = (type) => {

    const actions = type === "folder" ? 
    {move:MoveFolder , paste:pasetFolder}: 
    {move:MoveFile , paste:pasteFile};

    return actions;
    }

    const checkAlreadyExists = (name) =>{

      let newName = name;
      let counter = 1;
      let nameList;
      const dotIndex = newName.lastIndexOf('.');
      const baseName = dotIndex !== -1 ? newName.slice(0, dotIndex) : newName;
      const extension = dotIndex !== -1 ? newName.slice(dotIndex) : '';
      itemsBuffer.map((el)=>{
          nameList = el.data.type == "folder" ? childFolders : childFiles;
      })
      
      
      while (nameList.find(file => file.data.name === newName)) {
          newName = `${baseName}(${counter})${extension}`;
          counter++;
      }
  
      return newName; 
  }

  const pasetAction = () =>{
      itemsBuffer.map((el)=>{
          const name = checkAlreadyExists(el.data.name);
          const docId = el.docId;
          const parentId = el.data.parent;
          const path = currentFolder !== "root" ? [...currentFolderData.data.path,currentFolderData.docId]:[];
          const data = {
              ...el.data,
              name : name,
              path : path,
              parent : currentFolder,
          }
          const actions = getTypeActions(el.data.type);
          actionBuffer === "cut" ?
          dispatch(actions.move(docId,data,parentId)):
          dispatch(actions.paste(docId,data));      
      })
      dispatch(clearBuffer())        
  }  
  

  const handleCopyCut = (actionType) => {
    dispatch(addItemsToBuffer(selectedItems))
    dispatch(addActionBuffer(actionType));
    dispatch(clearSelectedItems()); 
  };
  
  const handleAction = (action, itemCondition) => {
    selectedItems.forEach((item) => {
      if (item.data.show === itemCondition) {
        const actionFunction = item.data.type.startsWith('folder') ? action.folder : action.file;
        dispatch(actionFunction(item));
      }
    });
    dispatch(clearSelectedItems()); 
  };

  const handleDelete = () => {
    currentFolder === "deletedFiles" ? forceDelete : softDelete;
    dispatch(clearSelectedItems());
  };
  const softDelete = () => {
    handleAction({ folder: softDeleteFolder, file: softDeleteFile }, true);
  };
  const forceDelete = () => {
    handleAction({ folder: deleteFolder, file: deleteFile }, false);
  };
  const handleRecovery = () => {
    handleAction({ folder: recoveryFolder, file: recoveryFile }, false);
  };
  const seletClass = `dropdown-item ${childFolders.length || childFiles.length > 0 || userDeletedFiles.length > 0 || userDeletedFolders.length > 0? '' : 'disabled'}`;
  const ItemClass = `dropdown-item ${selectedItems.length > 0 && selectItemsMode ? '' : 'disabled'}`;
  // const recoveryClass = `dropdown-item ${currentFolder !== "deletedFiles" ? 'disabled' : ''}`;
  return (
    <div id="dropdownId" className="dropdown mb-0">
      <a className="btn btn-link text-muted p-1 mt-n2" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
        <i className="mdi mdi-dots-vertical font-size-20"><FontAwesomeIcon icon={faAlignRight} /></i>
      </a>
      <ul className="dropdown-menu dropdown-menu-end">
        {itemsBuffer && actionBuffer && <li><a onClick={pasetAction} className="dropdown-item"><FontAwesomeIcon icon={faPaste} /> &nbsp;Paste </a></li>}
        <li><a onClick={() => dispatch(setSelectItemsMode(true))} className={seletClass} href="#"><FontAwesomeIcon icon={faSquareCheck} /> &nbsp; Select </a></li>
        <li><a onClick={() => handleCopyCut("copy")} className={ItemClass}><FontAwesomeIcon icon={faCopy} /> &nbsp;Copy </a></li>
        <li><a onClick={() => handleCopyCut("cut")} className={ItemClass}><FontAwesomeIcon icon={faScissors} /> &nbsp;Cut </a></li>
        <li><a onClick={handleDelete} className={ItemClass}><FontAwesomeIcon icon={faTrashCan} /> &nbsp;Delete </a></li>
        {currentFolder === "deletedFiles" ? <li><a onClick={handleRecovery} className={ItemClass}><FontAwesomeIcon icon={faArrowRotateRight} /> &nbsp;Recovery </a></li> : "" }
      </ul>
    </div>
  );
};

export default DropdownMenu;