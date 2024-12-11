import { FaCss3, FaHtml5, FaJs, FaFileAlt } from "react-icons/fa";
import { GrReactjs } from "react-icons/gr";

export const FileIcon = ({ extension }) => {
    const iconStyle = {
        height: "16px",
        width: "16px",
        marginRight: "5px", 
        marginLeft: '10px',
        display: "flex",
        alignItems: "center",
    };

    const IconMapper = {
        js: <FaJs color="#f1fa8c" style={iconStyle} />,
        jsx: <GrReactjs color="#61dbfa" style={iconStyle} />, 
        css: <FaCss3 color="#8be9fd" style={iconStyle} />,
        html: <FaHtml5 color="#ff5555" style={iconStyle} />,
    };

    return (
        <span style={{ display: "flex", alignItems: "center" }}>
            {IconMapper[extension] || (
                <FaFileAlt color="#6272a4" style={iconStyle} />
            )}
        </span>
    );
};
