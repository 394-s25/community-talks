// components/SidebarNav.jsx
import React from "react";
import "../css/SidebarNav.css";

export default function SidebarNav({ sections, getIconForTitle, onSelect }) {
    return (
        <nav className="sidebar-nav">
            {sections.map((section) => (
                <a
                    key={section.title}
                    href={`#${section.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className="sidebar-link"
                    onClick={(e) => {
                        e.preventDefault();
                        onSelect(section.title);
                    }}
                >
                    {getIconForTitle(section.title)}
                    <span>{section.title}</span>
                </a>
            ))}
        </nav>
    );
}
