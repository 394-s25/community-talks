import React,{ useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({data, onSearch, isForum}){

    const filterData = (query) => {
        // console.log("search data:", data);
        // console.log("search query:", query);
        if (query.length === 0){
            // console.log("empty search, return original data...", data);
            onSearch(data);
            return;
        }

        query.toLowerCase().trim();

        let filtered;

        if (isForum){
            filtered = data.filter((post) => 
                post.content.toLowerCase().trim().includes(query) 
                || post.title.toLowerCase().trim().includes(query)
                || post.tags.some((tag) => {
                    return tag.toLowerCase().includes(query);
                })
            );
        } else {
            filtered = data.filter((entry) =>  
                entry.name.toLowerCase().trim().includes(query)
            );
        }

        onSearch(filtered);
        return filtered;    
    }

    const handleSearch = () => {
        filterData();
    }

    const handleSearchChange = (e) => {
        filterData(e.target.value);
    }

    return (
        <div className="input-group" style={{alignItems: "flex-start",flexWrap: 'nowrap', width:"100%"}}>
            <div className="form-outline" style={{width: '90vw'}} data-mdb-input-init>
                <input 
                    type="search" 
                    id="project-search" 
                    name="query" 
                    className="form-control"
                    placeholder="Search projects"
                    aria-label="Search through project content"
                    onChange={handleSearchChange} />
            </div>
            <button type="button" onClick={handleSearch} className="btn btn-primary" data-mdb-ripple-init>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    );
}