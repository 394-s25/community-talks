import LoadingSpinner from "./LoadingSpinner";

const centerStyling = {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    maxHeight:"100vh"
};

const PageLoader = ({loading, children}) => {
    return loading ? (
        <div style={centerStyling}>
            <LoadingSpinner />
        </div>
    ) : (
        <>{children}</>
    );
};

export default PageLoader;