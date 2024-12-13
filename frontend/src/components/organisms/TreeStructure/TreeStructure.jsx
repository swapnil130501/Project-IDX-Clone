import React, { useEffect } from 'react'
import { useTreeStructureStore } from '../../../store/treeStructureStore'
import Tree from '../../molecules/Tree/Tree';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import FileContextMenu from '../../molecules/ContextMenu/FileContextMenu';
import FolderContextMenu from '../../molecules/ContextMenu/FolderContextMenu';
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';

function TreeStructure() {

    const { treeStructure, setTreeStructure } = useTreeStructureStore();
    const { isOpen: isFileContextMenuIsOpen, x: fileContextX, y: fileContextY, file} = useFileContextMenuStore();
    const { x: folderContextX, y: folderContextY, isOpen: isFolderContextMenuIsOpen, folder} = useFolderContextMenuStore();

    useEffect(() => {
        if (!treeStructure) {
            setTreeStructure();
        }
    }, [setTreeStructure, treeStructure]);

    return (
        <>
            {isFileContextMenuIsOpen && fileContextX && fileContextY && (
                <FileContextMenu 
                    x = {fileContextX}
                    y = {fileContextY}
                    path = {file}
                />
            )}

            {isFolderContextMenuIsOpen && folderContextX && folderContextY && (
                <FolderContextMenu 
                    x = {folderContextX}
                    y = {folderContextY}
                    path = {folder}
                />
            )}

            <Tree data={treeStructure} />
        </>
    );
}

export default TreeStructure;

