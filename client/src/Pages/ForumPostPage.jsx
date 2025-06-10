import React, {useState, useEffect, useMemo} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";
import AddCommentCard from "../components/AddCommentCard";
import TopBannerAlert from '../components/TopBannerAlert';
import SearchBar from "../components/SearchBar";
import NavBar from "../components/Navbar";
import { ref, get, push, query,orderByChild, equalTo, onValue} from "firebase/database";
import { db, auth } from "../firebase"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import "../css/HomePage.css";

export default function ForumPostPage(){
    const [isLoading, setIsLoading] = useState(false);
    const [showTopBanner, setShowTopBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("Alert!");
    const { postId } = useParams();
    const [commentData, setCommentData] = useState([]);
    const [commentTree, setCommentTree] = useState([]);
    const [isAddCommentOpen, setAddCommentOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const parentPost = location.state?.post;
    const parentPage = location.state?.onPage;
    const dbBaseRef = useMemo(() => ref(db, "forum_posts/comments"), [db]);


    // inital load
    useEffect(() => {
        setIsLoading(true);
        // get comment data according to postId
        const unsub = loadAllComments();
        
        setIsLoading(false);
        return () => unsub();

    },[]);

    useEffect(() => {
        // listen for comments
        loadAllComments();
    },[dbBaseRef]);



    const addComment = async (parentCommentUid=null, author, contentInfo) => {
        let username = auth.currentUser.email;
        try {
            const snap = await get(ref(db, 'users/' + author));
            if (snap.exists()){
                if (snap.val().username) {
                    username = snap.val().username;
                }
            }
        } catch (err) {
            console.error("Error retrieving username from db:", err);
        }

        const data = {
            parentPostId: postId,
            parentCommentId: parentCommentUid ? parentCommentUid : null,
            authorId: author,
            authorUserName: username,
            content: contentInfo,
            timestamp: Date.now(),
        }
        const commentRef = push(ref(db, "forum_posts/comments"), data);
    }

    const loadAllComments = () => {
        const commentsQry = query(dbBaseRef, orderByChild("parentPostId"), equalTo(postId));
        return onValue(commentsQry, (snap) => {
            if (snap.exists()){
                const comments = [];
                snap.forEach((child) => {
                    comments.push({id:child.key, ...child.val()});
                });
                setCommentData(comments);
                setCommentTree(buildCommentTree(comments));
            } else {
                setCommentData([]);
            }
        });
    }

    const navBack = () => {
        navigate("/forum", {state: {page: parentPage}});
    }

    const buildCommentTree = (data) => {
        const map = {};
        const roots = [];

        // create base reference mapping with comment data
        Array.from(data).forEach((comment) => {
            map[comment.id] = {...comment, children: []};
        });


        // build the tree
        Array.from(data).forEach((comment) => {
            if (comment.parentCommentId){
                map[comment.parentCommentId].children.push(map[comment.id]);
            } else { //this is a top level comment
                roots.push(map[comment.id]);
            }
        });


        return roots;
    }

    const canMakeComment = () => {
        if (auth.currentUser === null){
            setBannerMessage("You must be logged in to make a comment!");
            setShowTopBanner(true);
            return;
        }

        // open add comment component
        setAddCommentOpen(isAddCommentOpen ? false : true);
    }

    const onBannerClose = () => {
        setShowTopBanner(false);
        setBannerMessage("");
    }

    return (
        <div>
            <NavBar currentPage="/forum" /> 
            <div className='homepage-container' style={{padding: "2rem"}}>
                {/* <div> */}
                    <button className="back-button" onClick={() => navBack()} style={{display:"flex",left:0}}>
                        ← Back
                    </button>
                    <div>
                        <PostCard key={postId.id} post={parentPost} onPage={parentPage} onFullPage={true} addComment={addComment}/>
                    </div>
                    
                    
                        {/* comments container */}
                        <div className="section-card">
                            <div style={{display: "flex", justifyContent:"space-between", alignItems: "center"}}>
                                <div className="section-title">
                                    <h2><strong>Comments</strong></h2>
                                </div>
                                <div className="section-header">
                                    <button className="add-cmt" onClick={() => canMakeComment()} style={{display:"flex", gap:"0.6rem", background:"none", color: "black"}}>
                                        <FontAwesomeIcon className="icon" icon={faComment} fontSize={"1.5rem"} color="#007bff"/>
                                        <p>Add a Comment</p>
                                    </button>
                                </div>
                            </div>

                            <div className="section-content">
                                {/* For toplevel comments, so commentId=null (nothing needs to be passed)*/}
                                <AddCommentCard addComment={addComment} isOpen={isAddCommentOpen} onClose={() => setAddCommentOpen(false)}/>
                                
                                <PageLoader loading={isLoading}>
                                    {commentData.length === 0 ? <h5>No Comments</h5>
                                : commentTree.map((comment) => (
                                    <CommentCard key={comment.id} comment={comment} addComment={addComment} setShowTopBanner={setShowTopBanner} setBannerMessage={setBannerMessage}/>
                                ))}
                                </PageLoader>

                            </div>
                        </div>        
                { showTopBanner && 
                    (<TopBannerAlert 
                        message={bannerMessage} 
                        type={"error"} 
                        onClose={() => onBannerClose()}
                        />
                )}
            </div>
        </div>
    );
}