import React,{ useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({data, onSearch, isForum}){

    const filterData = (query) => {
        if (query.length === 0){
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
        <div className="input-group" style={{alignItems: "flex-start", justifyContent: "center",flexWrap: 'nowrap', width:"100%"}}>
            <div className="form-outline" style={{width: '90vw'}} data-mdb-input-init>
                <input 
                    type="search" 
                    id="project-search" 
                    name="query" 
                    className="form-control"
                    placeholder="Search posts"
                    aria-label="Search through forum posts"
                    onChange={handleSearchChange} />
            </div>
            <button type="button" onClick={handleSearch} className="btn btn-primary" style={{marginLeft:"-2.5px", marginTop: "0"}} data-mdb-ripple-init>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    );
}