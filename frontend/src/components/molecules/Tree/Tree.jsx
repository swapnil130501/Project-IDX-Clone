import { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";

function Tree({ data }) {

    const [expand, setExpand] = useState({});

    function handleExpand(name) {
        setExpand({
            ...expand,
            [name]: !expand[name]
        });
    }

    function computeExtension(data) {
        const names = data.name.split(".");
        return names[names.length - 1];
    }

    return (
        data && (
            <div style={{ paddingLeft: '15px', color: 'white' }}>
                {data.children ? (
                    <button
                        onClick={() => handleExpand(data.name)}
                        style={{
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            color: 'white',
                            backgroundColor: 'transparent',
                            padding: '15px',
                            fontSize: '16px',
                        }}
                    >
                        {expand[data.name] ? <IoIosArrowForward/> : <IoIosArrowDown/>}
                        {data.name}
                    </button>
                ) : (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <FileIcon extension={computeExtension(data)}/>
                        <p
                            style={{
                                marginLeft: '5px',
                                cursor: 'pointer',
                                paddingTop: '10px',
                                fontSize: '15px',
                                color: 'white'
                            }}
                        >
                            {data.name}
                        </p>
                    </div>
                )}
                {expand[data.name] &&
                    data.children?.length > 0 &&
                    data.children.map((it) => <Tree data={it} key={it.name} />)}
            </div>
        )
    );
}

export default Tree;