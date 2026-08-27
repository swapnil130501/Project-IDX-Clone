import React, { useEffect } from 'react'
import { useTreeStructureStore } from '../../../store/treeStructureStore'
import Tree from '../../molecules/Tree/Tree';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import FileContextMenu from '../../molecules/ContextMenu/FileContextMenu';
import FolderContextMenu from '../../molecules/ContextMenu/FolderContextMenu';
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';
import Spinner from '../../atoms/Spinner/Spinner';

function TreeStructure() {

    const { treeStructure, treeStructureError, setTreeStructure } = useTreeStructureStore();
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
        
            {treeStructureError ? (
                <p className="px-2 py-2 font-ui text-[13px] text-ink-faint">
                    {treeStructureError}
                </p>
            ) : treeStructure ? (
                <Tree data={treeStructure} />
            ) : (
                <div className="flex items-center gap-2 px-2 py-2">
                    <Spinner size="sm" />
                    <p className="font-ui text-[13px] text-ink-faint">Loading files…</p>
                </div>
            )}
        </>
    );
}

export default TreeStructure;

