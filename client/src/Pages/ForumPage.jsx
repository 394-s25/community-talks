import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from '../components/PageLoader';
import PostCard from '../components/PostCard';
import NavBar from '../components/Navbar';
import TopBannerAlert from '../components/TopBannerAlert';
import SearchBar from '../components/SearchBar';
import ForumPostModal from "../components/ForumPostModal";
import PaginationComp from '../components/Pagination';
import { ref, get, push, query, orderByChild, endBefore, limitToLast } from "firebase/database";
import { db, auth } from "../firebase"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import "../css/HomePage.css";
import "../css/Issue.css";



export default function ForumPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTopBanner, setShowTopBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("Alert!");
    const forumDbBaseRef = "forum_posts";
    const [currPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(2);
    const [allPosts, setAllPosts] = useState([]);
    const [currentPosts, setCurrPosts] = useState([]); // holds all the posts
    const [currentFilteredPosts, setCurrentFilteredPosts] = useState([]); // holds all the filtered posts (filtered according to tag and search query)
    const [prevPostTimestamp, setPrevPostTimestamp] = useState(null);
    
    const lastPostIdx = currPage * postsPerPage; // idx of the last post within curr page
    const firstPostIdx = lastPostIdx - postsPerPage; // idx of the first post within curr page


    const addPost = async ({titleInfo, contentInfo, user=null, tagsArray}) => {
        // tags is a list
        let username = auth.currentUser.email;
        try {
            const snap = await get(ref(db, 'users/' + auth.currentUser.uid));
            if (snap.exists()){
                if (snap.val().username) {
                    username = snap.val().username;
                }
            }
        } catch (err) {
            console.error("Error retrieving username from db:", err);
        }

        const data = {
            title: titleInfo,
            content: contentInfo,
            creator: user !== null ? user:"None",
            creatorUserName: username,
            tags: tagsArray,
            timestamp: Date.now(),
        }


        // push this post
        const postRef = push(ref(db, `${forumDbBaseRef}/posts`), data);
    }

    

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            // fetch all the posts once, turn it into an array
            // and calc how many pages we need
            const dbRef = ref(db, `${forumDbBaseRef}/posts`);
            const qry = query(dbRef, orderByChild("timestamp"));
            const snap = await get(qry);
            if (snap.exists()){
                const results = Object.entries(snap.val())
                    .map(([key, val]) => ({id:key, ...val}))
                    .sort((a,b) => b.timestamp - a.timestamp);

                setAllPosts(results); 
                setCurrPosts(results.slice(firstPostIdx, lastPostIdx));
                setPrevPostTimestamp(results[results.length - 1]?.timestamp);
            } else {
                setAllPosts([]);
                setCurrPosts([]);
                console.warn("No data found");
                setCurrentPage(1);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching post data:", err);
        }
        setIsLoading(false);
    }

    const fetchPage = () => {
        if (currentFilteredPosts.length > 0){
            setCurrPosts(currentFilteredPosts.slice(firstPostIdx, lastPostIdx));
        } else {
            setCurrPosts(allPosts.slice(firstPostIdx, lastPostIdx));
        }
    };

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

    const filterPosts = (filteredData) => {
        setCurrentFilteredPosts(filteredData);
    }

    const makePost = () => {
        // if user is logged in, they can make a post
        if (auth.currentUser === null) {
            setBannerMessage("You must be logged in to make a post!");
            setShowTopBanner(true);
            return;
        }
        setIsModalOpen(true);
    }

    const onBannerClose = () => {
        setShowTopBanner(false);
        setBannerMessage("");
    }


    useEffect(() => {
        // fetch all the post data
        fetchPosts();
        setCurrentPage(location.state?.page);
    },[]);

    useEffect(() => {
        fetchPage();
    },[currPage]);

    useEffect(() => {
        const toggle = isModalOpen ? "hidden" : "auto";
        document.body.style.overflow = toggle;
    }, [isModalOpen]);

    return (
        <div>
            <NavBar currentPage='/forum'/>
            <div className='homepage-container'>
                <header className="homepage-header" style={{paddingTop: "2.5rem"}}>
                    <h1>Community Forum</h1>
                    <p>Your hub for engaging discussions</p>
                </header>
                <div className='forum-container'>
                    <SearchBar data={allPosts} onSearch={filterPosts} isForum={true}/>
                    
                    <div style={{display:"flex", justifyContent:"flex-end"}}>
                        <button className="add-cmt"  onClick={() => makePost()} style={{display:"flex", gap:"0.6rem", background:"none", color: "black"}}>
                            <FontAwesomeIcon className='icon'  icon={faComment} fontSize={"1.5rem"} color="#007bff"/>
                            <p>Make a Post</p>
                        </button>
                    </div>
                    <div>
                        <PageLoader loading={isLoading}>
                            {currentPosts.length === 0 
                                ? <div style={{display:"flex", alignItems:"center", justifyContent:"center", margin: "auto 0"}}><h2>No Posts Available</h2></div> 
                                :currentPosts.map((post) => (
                                <PostCard key={post.id} post={post} onPage={currPage}/>
                            ))}
                        </PageLoader>
                    </div>

                    {/* page numbers */}
                    <PaginationComp 
                        totalPosts={currentFilteredPosts.length === 0 ? allPosts.length : currentFilteredPosts.length} 
                        postsPerPage={postsPerPage} 
                        setCurrentPage={setCurrentPage}
                        currPage={currPage}/>

                </div>
            
                <ForumPostModal 
                    isPost={true}
                    addPost={addPost}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}/>
                
                { showTopBanner && (<TopBannerAlert 
                                        message={bannerMessage} 
                                        type={"error"} 
                                        onClose={() => onBannerClose()}
                                        />
                )}

            </div>
        </div>
    )
}