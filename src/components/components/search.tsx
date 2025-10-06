// SearchComponent.tsx

import React from "react";
import { debounceTime } from "src/helpers/helpers";
import { Input } from "./ui/input";

interface SearchProps {
  onSearch: (value: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({ onSearch }) => {
  const funDebonce = (message: string) => {
    onSearch(message);
  };

  const debouncedShowMessage = debounceTime(funDebonce, 1000);

  return (
    <div className="search-component">
      <i className="bi bi-search search-icon" />

      <Input
        type="text"
        placeholder="Recherchez..."
        className="w-full md:w-auto form-control"
        onChange={(e) => debouncedShowMessage(e.target.value)}
      />
      <style>{`
                .search-component {
                    width: 90%;
                    height: 55%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .search-input {
                    width: 50%;
                    padding: 10px;
                    font-size: 18px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }
            `}</style>
    </div>
  );
};

export default SearchComponent;
