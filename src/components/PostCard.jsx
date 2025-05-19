import "../css/HomePage.css";
import "../css/Issue.css";

export default function PostCard({title, content}){
    return (
        <div className="section-card">
            <div className="section-header">
                <h2 className="section-title-large">{title}</h2>
            </div>
            <div className="section-content">
                <p className="section-paragraph">{content}</p>
            </div>
      </div>
    )
}