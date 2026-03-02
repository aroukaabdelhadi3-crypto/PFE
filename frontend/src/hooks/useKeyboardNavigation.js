import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useKeyboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape key to go back
      if (event.key === 'Escape') {
        // Don't go back if we're on a main dashboard or login page
        const mainPages = ['/dashboard', '/login', '/'];
        const isMainPage = mainPages.some(page => 
          location.pathname === page || location.pathname.endsWith('/dashboard')
        );
        
        if (!isMainPage) {
          navigate(-1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, location]);
};
