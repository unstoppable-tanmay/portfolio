import React, { useState, useEffect, useRef, ComponentType } from "react";

export function withVirtualize<P extends object>(
  WrappedComponent: ComponentType<P>,
  placeholderHeight: string
) {
  const VirtualizedComponent = (props: P) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        },
        {
          root: null,
          rootMargin: "200px",
          threshold: 0.1,
        }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={elementRef}
        style={{
          height: placeholderHeight,
          overflow: "hidden",
        }}
      >
        <div style={{ display: isVisible ? "block" : "none" }}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  return VirtualizedComponent;
}
