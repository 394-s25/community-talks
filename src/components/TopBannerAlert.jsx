import "../css/modal.css";

export default function TopBannerAlert({message, type="info", onClose}){
    // available types: info and error

    return (
        <div className={`top-alert ${type}`}>
            {message}
            <button
            onClick={onClose}
            className="close-button"
            >
            X
            </button>
        </div>
        );
}