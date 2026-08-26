import PropTypes from "prop-types";
import { FaCss3, FaHtml5, FaJs, FaFileAlt } from "react-icons/fa";
import { GrReactjs } from "react-icons/gr";

export const FileIcon = ({ extension, compact = false }) => {
    const iconStyle = {
        height: compact ? "14px" : "16px",
        width: compact ? "14px" : "16px",
        marginRight: compact ? "0" : "5px",
        marginLeft: compact ? "0" : "10px",
        display: "flex",
        alignItems: "center",
    };

    const IconMapper = {
        js: <FaJs style={iconStyle} />,
        jsx: <GrReactjs style={iconStyle} />,
        css: <FaCss3 style={iconStyle} />,
        html: <FaHtml5 style={iconStyle} />,
    };

    return (
        <span style={{ display: "flex", alignItems: "center" }}>
            {IconMapper[extension] || <FaFileAlt style={iconStyle} />}
        </span>
    );
};

FileIcon.propTypes = {
    extension: PropTypes.string,
    compact: PropTypes.bool,
};
