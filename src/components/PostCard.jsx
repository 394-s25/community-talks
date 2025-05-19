import "../css/HomePage.css";
import "../css/Issue.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';


export default function PostCard({title, content, tags}){

    const openCard = () => {
        console.log("Open Card Modal for this forum post:", title);
    }

    return (
        <div className="section-card post-card-container" onClick={() => openCard()}>
            <div className="section-header">
                <h2 className="section-title-large">{title}</h2>
            </div>
            <div className="section-content">
                <div>
                    {tags?.map((tag) => <button diasbled="true" key={tag} className="tag-button post-card">{tag}</button>)}
                </div>
                <p className="section-paragraph">{content}</p>
                {/* move the add comment to the modal */}
                <button style={{display:"flex", gap:"0.6rem", background:"none"}}>
                    <FontAwesomeIcon icon={faComment} fontSize={"1.5rem"} color="#007bff"/>
                    <p>Add a Comment</p>
                </button>
            </div>
      </div>
    )
}