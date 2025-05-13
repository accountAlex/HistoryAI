import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant' // Можно 'smooth' если хочешь плавно
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
