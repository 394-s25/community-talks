import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import PageLoader from '../components/PageLoader';
import PostCard from '../components/PostCard';
import { ref, get, push, query, orderByChild, endBefore, limitToLast } from "firebase/database";
import { db, auth } from "../firebase"; 
import "../css/HomePage.css";
import "../css/Issue.css";
import { setISODay } from 'date-fns';

const tempData = {
    "post1": "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.",
    "post2": "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere",
    "post1/comment1": "Comment 1 for Post 1: Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. ",
    "post1/comment2": "Comment 2 for Post 1: Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. ",
    "post3": "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere",
    "post4": "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere",
    "post5": "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere",
}

const tempDataPosts = [
    {title: "post1", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.", tags: ["general"]},
    {tags: ["general"], title: "post2", content: "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere"},
    {tags: ["resources"], title: "post3", content: "Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. "},
    {tags: ["general", "resources"], title: "post4", content: "Pulvinar vivamus fringilla lacus nec metus bibendum egestas. "},
    {tags: ["general"], title: "post5", content: "Iaculis massa nisl malesuada, Pulvinar vivamus fringilla lacus nec metus bibendum egestas. "}
]



export default function ForumPage(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [once, isOnce] = useState(true);
    const forumDbBaseRef = "forum_posts";
    const [currPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(2);
    const [currentPosts, setCurrPosts] = useState([]);
    const [prevPostTimestamp, setPrevPostTimestamp] = useState(null);
    
    const lastPostIdx = currPage * postsPerPage; // idx of the last post within curr page
    const firstPostIdx = lastPostIdx - postsPerPage; // idx of the first post within curr page
    // for temp data; for real data, will pull per page according to index
    // const currPosts = tempDataPosts.slice(firstPostIdx, lastPostIdx);
    // const currPosts = tempDataPosts;


    const addPosts = () => {
        // a temp function for testing and populating
        // Object.entries(tempDataPosts).map(([key, val]) => {
        //     console.log(key, val);
        // });

        tempDataPosts.forEach((post) => {
            addPost({titleInfo: post.title, contentInfo: post.content, tags: post.tags});
        });
    }

    const addPost = ({titleInfo, contentInfo, user=null, tags}) => {
        // tags is a list
        const data = {
            title: titleInfo,
            content: contentInfo,
            creator: user?user:"None",
            tag: tags,
            timestamp: Date.now(),
        }

        // push this post
        const postRef = push(ref(db, `${forumDbBaseRef}/posts`), data);
        // for each tag push this postRef (keeping track of all the posts under a common tag)
        tags.forEach((tag) => {
            push(ref(db, `${forumDbBaseRef}/${tag}`), postRef.key);
        });
        console.log("finished pushing:", postRef.key);
    }

    const addComment = ({parentUuid, contentInfo, user, tags}) => {

    }

    const fetchNextPage = async () => {
        setIsLoading(true);
        try {
            const dbRef = ref(db, `${forumDbBaseRef}/posts`);
            let qry;

            if (currPage === 1){
                qry = query(dbRef, orderByChild("timestamp"), limitToLast(postsPerPage));
            } else if (prevPostTimestamp){
                qry = query(dbRef, orderByChild("timestamp"), endBefore(prevPostTimestamp), limitToLast(postsPerPage));
            }

            const snap = await get(qry);
            if (snap.exists()){
                const results = Object.entries(snap.val())
                    .map(([key, val]) => ({id:key, ...val}))
                    .sort((a,b) => b.timestamp - a.timestamp);

                console.log(results);
                setCurrPosts(results);
                setPrevPostTimestamp(results[results.length - 1]?.timestamp);
            } else {
                setCurrPosts([]);
                console.warn("No data found");
                setCurrentPage(1);
            }
            
            setIsLoading(false);

        } catch (error) {
            console.error("Error fetching page", currPage, ":", error);
            setIsLoading(false);
        }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    },[]);

    useEffect(() => {
        fetchNextPage();
    },[currPage]);

    return (
        <div className='homepage-container'>
            <header className="homepage-header">
                <button className="back-button" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>Community Forum</h1>
                <p>Your hub for engaging discussions</p>
                <button className="homepage-button" onClick={() => navigate("/profile")}>Go to Profile</button>
                <button className="homepage-button" onClick={() => navigate("/forum")}>Go to Community Forum</button>
            </header>
            <div className='forum-container'>
                <div>
                    <PageLoader loading={isLoading}>
                        {currentPosts.map((post) => (
                            <PostCard key={post.id} title={post.title} content={post.content}/>
                        ))}
                    </PageLoader>
                    <div>
                        <button className="page-number-button" disabled={currPage === 1} onClick={() => setCurrentPage(currPage - 1)}>Prev</button>
                        <button className="page-number-button" onClick={() => setCurrentPage(currPage + 1)}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}