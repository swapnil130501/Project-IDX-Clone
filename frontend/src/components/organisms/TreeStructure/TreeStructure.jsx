import React, { useEffect } from 'react'
import { useTreeStructureStore } from '../../../store/treeStructureStore'
import Tree from '../../molecules/Tree/Tree';

function TreeStructure() {

    const { treeStructure, setTreeStructure } = useTreeStructureStore();

    useEffect(() => {
        if (!treeStructure) {
            setTreeStructure();
        }
    }, [setTreeStructure, treeStructure]);


    return (
        <div>
            <Tree data={treeStructure} />
        </div>
    );
}

export default TreeStructure;

