import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // A small timeout ensures the route transition has "settled" 
        // and the new content is injected before we scroll.
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 10);

        return () => clearTimeout(timer);
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
