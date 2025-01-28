import UiSearchInput from "@/components/ui/search-input/search-input";
import { useDebounce } from "@/hooks/useSearch";
import React, { useState, useCallback, useEffect } from "react";

interface OptimizedSearchComponentProps {
  // eslint-disable-next-line no-unused-vars
  onSearch: (query: string) => void;
  title?: string;
}

const OptimizedSearchComponent: React.FC<OptimizedSearchComponentProps> = ({ onSearch, title }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  return <UiSearchInput placeholder={title ? title : "Buscar cliente"} onChange={handleSearch} />;
};

export default OptimizedSearchComponent;
