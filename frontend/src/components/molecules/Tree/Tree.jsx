import { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";

function Tree({ data }) {
    const [expand, setExpand] = useState({});

    function handleExpand(name) {
        setExpand({
            ...expand,
            [name]: !expand[name],
        });
    }

    function computeExtension(data) {
        const names = data.name.split(".");
        return names.length > 1 ? names[names.length - 1] : null;
    }

    return (
        data && (
            <div
                style={{
                    paddingLeft: "15px",
                    backgroundColor: "#21222C",
                    color: "#f8f8f2",
                    fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                    fontSize: "13px", 
                    lineHeight: "1.5", 
                }}
            >
                {data.children ? (
                    <button
                        onClick={() => handleExpand(data.name)}
                        style={{
                            border: "none",
                            cursor: "pointer",
                            outline: "none",
                            backgroundColor: "transparent",
                            padding: "10px",
                            fontSize: "15px",
                            fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                            color: expand[data.name] ? "#ff79c6" : "#bd93f9",
                            display: "flex",
                            alignItems: "center",
                            lineHeight: "1.5",
                        }}
                    >
                        <span
                            style={{
                                marginRight: "5px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {expand[data.name] ? (
                                <IoIosArrowDown style={{ color: "#50fa7b", fontSize: "14px" }} /> 
                            ) : (
                                <IoIosArrowForward style={{ color: "#ff79c6", fontSize: "14px" }} />
                            )}
                        </span>
                        {data.name}
                    </button>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "5px 0",
                            cursor: "pointer",
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "5px",
                            }}
                        >
                            <FileIcon extension={computeExtension(data)} />
                        </span>
                        <p
                            style={{
                                marginLeft: "10px",
                                fontSize: "13px",
                                fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                                lineHeight: "1.5",
                                color: "#f8f8f2",
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
