import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import PageLoader from '../components/PageLoader';
import PostCard from '../components/PostCard';
import NavBar from '../components/Navbar';
import ForumPostModal from "../components/ForumPostModal";
import { ref, get, push, query, orderByChild, endBefore, limitToLast } from "firebase/database";
import { db, auth } from "../firebase"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faComment } from '@fortawesome/free-solid-svg-icons';
import "../css/HomePage.css";
import "../css/Issue.css";



export default function ForumPage(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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


    const addPost = ({titleInfo, contentInfo, user=null, tagsArray}) => {
        // tags is a list
        console.log(titleInfo, contentInfo, user,tagsArray )
        const data = {
            title: titleInfo,
            content: contentInfo,
            creator: user?user:"None",
            tags: tagsArray,
            timestamp: Date.now(),
        }

        // push this post
        console.log(data);
        const postRef = push(ref(db, `${forumDbBaseRef}/posts`), data);
        // for each tag push this postRef (keeping track of all the posts under a common tag)
        tagsArray.forEach((tag) => {
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

    useEffect(() => {
        const toggle = isModalOpen ? "hidden" : "auto";
        document.body.style.overflow = toggle;
    }, [isModalOpen]);

    return (
        <div className='homepage-container'>
            <header className="homepage-header">
                <button className="back-button" onClick={() => navigate("/")} style={{display:"flex",left:0}}>
                    ← Back to Home
                </button>
                <h1>Community Forum</h1>
                <p>Your hub for engaging discussions</p>
                <NavBar/>
            </header>
            <div className='forum-container'>
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <button onClick={() => setIsModalOpen(true)} className='add-cmt' style={{display:"flex", gap:"0.6rem", background:"none"}}>
                        <FontAwesomeIcon icon={faComment} fontSize={"1.5rem"} color="#007bff"/>
                        <p>Make a Post</p>
                    </button>
                </div>
                <div className="forum-content">
                    <PageLoader loading={isLoading}>
                        {currentPosts.length === 0 
                            ? <div style={{display:"flex", alignItems:"center", justifyContent:"center", margin: "auto 0"}}><h2>No Posts Available</h2></div> 
                            :currentPosts.map((post) => (
                            <PostCard key={post.id} post={post}/>
                        ))}
                    </PageLoader>
                    </div>
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <button className="page-number-button" disabled={currPage === 1} onClick={() => setCurrentPage(currPage - 1)}>
                        <FontAwesomeIcon icon={faArrowLeft} size="1x"/>
                    </button>
                    <button className="page-number-button" onClick={() => setCurrentPage(currPage + 1)}>
                        <FontAwesomeIcon icon={faArrowRight} size="1x"/>
                    </button>
                </div>
            </div>
        
            <ForumPostModal 
                isPost={true}
                addPost={addPost}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}/>
            {/* isPost, addPost, isOpen, onClose */}

        </div>
    )
}