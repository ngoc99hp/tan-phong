'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Component xử lý scroll dựa trên URL query parameter
 * Ví dụ: /?scrollTo=contact
 */
export function ScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    
    if (scrollTo) {
      // Đợi DOM render và animation của page transition
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams]);

  return null;
}