import React, { useEffect } from 'react'
import { useTreeStructureStore } from '../../../store/treeStructureStore'
import Tree from '../../molecules/Tree/Tree';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import FileContextMenu from '../../molecules/ContextMenu/FileContextMenu';

function TreeStructure() {

    const { treeStructure, setTreeStructure } = useTreeStructureStore();
    const {x, y, isOpen, file} = useFileContextMenuStore();

    useEffect(() => {
        if (!treeStructure) {
            setTreeStructure();
        }
    }, [setTreeStructure, treeStructure]);


    return (
        <>
            {x && y && isOpen && (
                <FileContextMenu 
                    x = {x}
                    y = {y}
                    path = {file}
                />
            )}
            <Tree data={treeStructure} />
        </>
    );
}

export default TreeStructure;

