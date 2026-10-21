import './SearchBar.css';
import { useRef } from 'react';

type SearchField = 'title' | 'author' | 'date';

type SearchBarProps = {
    searchTerm: string;
    searchField: SearchField;
    setSearchTerm: (searchTerm: string) => void;
    setSearchField: (searchField: SearchField) => void;
};

export default function SearchBar({
    searchTerm,
    searchField,
    setSearchTerm,
    setSearchField,
}: SearchBarProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="search-bar">
            <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder={`Search for books by ${searchField}`}
            />
            <select
                value={searchField}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'title' || value === 'author' || value === 'date') {
                        setSearchField(value);
                    }
                    setSearchTerm('');

                }}
                aria-label="Search books by"
                className="search-bar--options"
            >
                <option value="title">By Title</option>
                <option value="author">By Author</option>
                <option value="date">By Publication Date</option>
            </select>
        </div>
    );
}