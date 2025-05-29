import React, {useState, useEffect} from "react";
import { ref, get, push, query} from "firebase/database";
import { db, auth } from "../firebase"; 
import PageLoader from "../components/PageLoader";
import AddCommentCard from "../components/AddCommentCard";
import TopBannerAlert from "./TopBannerAlert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import "../css/comments.css";
import "../css/HomePage.css";
import "../css/modal.css";

export default function CommentCard({comment, addComment, setShowTopBanner, setBannerMessage}){
    const [repliesText, setrepliesText] = useState("View replies");
    const [isLoading, setIsLoading] = useState(false);
    const [isAddCommentOpen, setAddCommentOpen] = useState(false);
    const [isRepliesOpen, setRepliesOpen] = useState(false);
    

    // forum_posts/comments
    //     commentUID
    //     Parent post id
    //     Parent comment id // TOP LEVEL COMMENT
    //     authorId
    //     Content
    //     timestamp


    const toggleReplies = () => {
        // make p-1st child text = Hide
        setrepliesText(repliesText === "View replies" ? "Hide" : "View replies");
        setRepliesOpen(isRepliesOpen ? false : true);
    }

    // checks if a user is logged in, 
    // if they are they can make a comment
    const makeComment = () => {
        if (auth.currentUser === null){
            setBannerMessage("You must be logged in to reply a comment!");
            setShowTopBanner(true);
            return;
        }

        // open add comment component
        isAddCommentOpen ? setAddCommentOpen(false) : setAddCommentOpen(true);
    }

    const onBannerClose = () => {
        setShowTopBanner(false);
        setBannerMessage("");
    }

    const convertTimestamp = (timestamp) => {
        const currDate = new Date(Date.now());
        const createdDate = new Date(timestamp);
        const diff = currDate.getTime() - createdDate.getTime();
        // check the time unit of time elapse
        let displayedDiff = diff;
        let timeUnit = "sec ago";
        if (Math.floor(diff / (1000 * 60 * 60 * 24)) > 0){
            displayedDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
            timeUnit = displayedDiff === 1 ? "day ago" : "days ago";
        } else if (Math.floor(diff / (1000 * 60 * 60)) > 0){
            displayedDiff = Math.floor(diff / (1000 * 60 * 60));
            timeUnit = displayedDiff === 1 ? "hour ago" : "hours ago";
        } else if (Math.floor(diff / (1000 * 60)) > 0){
            displayedDiff = Math.floor(diff / (1000 * 60));
            timeUnit = displayedDiff === 1 ? "minute ago" : "minutes ago";
        } else {
            displayedDiff = Math.floor(diff / 1000);
            timeUnit = displayedDiff === 1 ? "second ago" : "seconds ago";
        }
        
        return displayedDiff + " " + timeUnit;
    }


    return(
        <div className="comment-container">
            <div className="comment-profile-container">
                <p className="clickable">{comment.authorUserName}</p>
                <p>{convertTimestamp(comment.timestamp)}</p>
            </div>
            <div className="comment-body">
                {comment.content}
            </div>
            <div className="comment-footer">
                <div>
                    {/* Make a Comment */}
                    <p className="clickable min-font" onClick={makeComment}>
                        Reply
                    </p>
                </div>
                <div>
                    <FontAwesomeIcon className="icon" icon={faThumbsUp} fontSize={"1.2rem"} color="#007bff"/>
                    <FontAwesomeIcon className="icon" icon={faThumbsDown} fontSize={"1.2rem"} color="#007bff"/>
                </div>
            </div>
            <AddCommentCard addComment={addComment} commentId={comment.id} isOpen={isAddCommentOpen} onClose={() => setAddCommentOpen(false)}/>
            
            {/* hidden - on click show the comments */}
            <div className="min-font">
                {comment.children && comment.children.length > 0 
                    ? <p className="clickable" onClick={() => toggleReplies(comment.id)}>{repliesText}</p>     
                    : <></>       
                }
            </div>
            
            {/* more comments 'dropdown' */}
            <div className={isRepliesOpen ? "comment-replies" : "comment-replies inactive"}>
                <PageLoader loading={isLoading}/>
                {comment.children && comment.children.length > 0 && (
                    <div className="reply">
                    {comment.children.map((child) => (
                        <CommentCard key={comment.id} comment={child} addComment={addComment} setShowTopBanner={setShowTopBanner} setBannerMessage={setBannerMessage}/>
                    ))}
                </div>)}
            </div>
        </div>
    )
}