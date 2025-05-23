import React, {useState, useEffect} from "react";
import PageLoader from "../components/PageLoader";

export default function ForumPostPage({parentPost}){
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div>
            <div><h2>The Full Post of the Parent Post</h2></div>
            <PageLoader loading={isLoading}>
                <div><h2>Comments to Post</h2></div>
            </PageLoader>
            
        </div>
    );
}