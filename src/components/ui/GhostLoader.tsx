import "./GhostLoader.css";

export const GhostLoader = () => {
    return (
        <div className="ghost-loader-container">
            <div className="ghost-container">
                <div className="ghost">
                    <div className="arms">
                        <div className="arm arm-left"></div>
                        <div className="arm arm-right"></div>
                    </div>

                    <div className="ghost-body">
                        <div className="eyes">
                            <div className="eye"></div>
                            <div className="eye"></div>
                        </div>
                    </div>

                    <div className="ghost-tail">
                        <div className="tail-wave"></div>
                        <div className="tail-wave"></div>
                        <div className="tail-wave"></div>
                        <div className="tail-wave"></div>
                    </div>
                </div>
            </div>
            <p className="mt-8 text-muted-foreground animate-pulse">Loading...</p>
        </div>
    );
};
