'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Component xử lý scroll dựa trên URL query parameter
 * Ví dụ: /?scrollTo=contact
 */
function ScrollHandlerInner() {
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

// ✅ Wrap trong Suspense để tránh lỗi khi deploy
export function ScrollHandler() {
  return (
    <Suspense fallback={null}>
      <ScrollHandlerInner />
    </Suspense>
  );
}