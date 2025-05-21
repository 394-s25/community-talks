// Modal for commenting and posting
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { db, auth } from "../firebase";
import { ref, push, update, child } from "firebase/database";
import "../css/modal.css";

export default function ForumPostModal({isPost, addPost, isOpen, onClose}){
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [tags, setTags] = useState([]);

    if (!isOpen) return null;

    const tagOptions = [
        {value: "general", label: "General"},
        {value: "resources", label: "Resources"},
        {value: "safety", label:"Safety"},
        {value: "committee", label:"Committee"},
        {value: "grants", label:"Grants"},
        {value: "involvement", label:"Get Involved"}                    
    ];

    const handleSelectTags = (selected) => {
        const chosen = selected ? selected.map((tag) => tag.value) : [];
        console.log(chosen);
        setTags(chosen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            addPost({titleInfo: title, contentInfo: message, user: auth.currentUser.uid, tagsArray:tags});
            console.log("Posted");
            // clear all data
            setTitle("");
            setTags([]);
            setMessage("");
            onClose();

        } catch (err) {
            console.error("Error handling post form submit:", err);
        }
    }

    return(
        <div className="modal-overlay">
            <div className="modal-box">
                <button className="modal-close" onClick={onClose}>
                ×
                </button>
                <h2>{isPost ? "Create Post" : "Add Comment"}</h2>
                <form onSubmit={handleSubmit} className="forum-form">
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" required/>
                    
                    <label htmlFor="tags">Choose tags for post:</label>
                    <Select htmlFor="tags" 
                        options={tagOptions} 
                        isMulti 
                        value={tagOptions.filter((option) => tags.includes(option.value))} 
                        onChange={(selected) => handleSelectTags(selected)} 
                        placeholder="Tags..."
                    />

                    <label htmlFor="content">Description</label>
                    <textarea
                        placeholder="Post Description"
                        id = "content"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />

                    
                    {/* <select id="tags" multiple value={tags} onChange={handleSelectTags}>
                        <option>General</option>
                        <option>Resources</option>
                        <option>Safety</option>
                        <option>Committee</option>
                        <option>Grants</option>
                        <option>Get Involved</option>
                    </select> */}

                    <button type="submit">{isPost ? "Post" : "Comment"}</button>
                </form>
            </div>
        </div>
    );
}