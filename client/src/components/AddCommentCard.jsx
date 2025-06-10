import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/Issue.css";
import React, {useState} from 'react';
import { auth } from "../firebase"; 

export default function AddCommentCard({addComment, commentId=null, isOpen=false, onClose}){
    const [content, setContent] = useState("");
    if (!isOpen) return;

    const handlePost = async (e) => {
        e.preventDefault();
        try{
            const author = auth.currentUser?.uid ? auth.currentUser?.uid : "None";
            addComment(commentId, author, content);
            setContent("");
            onClose();
        } catch (err) {
            console.error("Error submitting comment on post:", err);
        }
    }

    const close = () => {
        setContent("");
        onClose();
    }

    return (
            <div className="card" style={{border:"none"}}>
                <div className="py-3 border-0">
                    <form onSubmit={handlePost}>
                        <div className="d-flex flex-start w-100">
                            <div data-mdb-input-init className="form-outline w-100">
                                <textarea className="form-control" 
                                            id="commentContent" 
                                            rows="4"
                                            style={{background: "#fff"}} 
                                            placeholder='Message' 
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                />
                                <label className="form-label" htmlFor="commentContent"></label>
                            </div>
                        </div>
                        <div className="float-end mt-2 pt-1">
                            <button  type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-sm" style={{marginRight:"0.5rem"}}>Post comment</button>
                            <button  type="button" onClick={() => close()} data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-primary btn-sm">Cancel</button>
                        </div>
                    </form>
                </div>

            </div>

    )
}