import { useAppContext } from '../context/AppContext';
import NewPipeService from '../services/NewPipeService';

export const useSearch = () => {
  const {
    query,
    setResults,
    setLoading,
    setError,
  } = useAppContext();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const searchResults = await NewPipeService.searchYoutube(`${query.trim()} music`);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  return { handleSearch };
}; 