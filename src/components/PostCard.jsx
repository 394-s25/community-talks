import "../css/HomePage.css"; //holds most off the new css
import "../css/comments.css";
import "../css/Issue.css";
import AddCommentCard from "../components/AddCommentCard";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';


export default function PostCard({post, onPage, onFullPage=false}){
    // onpage (the posts location on the forum page)
    const navigate = useNavigate();
    const parentClassName = onFullPage ? "section-card" : "section-card post-card-container";
    const contentStyle = onFullPage 
                            ? {}
                            : {textOverflow:"ellipsis", overflow:"hidden", display:"-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient:"vertical"};

    const openCard = () => {
        console.log("[nav to: ","/forum/posts/" + post.id,"]Open Card Modal for this forum post:", post.title);
        navigate("/forum/posts/" + post.id, {state: 
                                                { post: post, onPage: onPage}});
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

    // if on full page allow commenting


    return (
        <div className={parentClassName} onClick={() => openCard()}>
            <div className="comment-profile-container" style={{marginBottom:"0.5rem"}}>
                <p className="clickable">{post?.creatorUserName}</p>
                <p>{convertTimestamp(post.timestamp)}</p>
            </div>
            <div className="section-header">
                <h2 className="section-title-large">{post.title}</h2>
            </div>
            <div className="section-content">
                <div>
                    {post.tags?.map((tag) => <button diasbled="true" key={tag} className="tag-button post-card">{tag}</button>)}
                </div>
                <p className="section-paragraph" style={contentStyle}>{post.content}</p>
            </div>
      </div>
    )
}