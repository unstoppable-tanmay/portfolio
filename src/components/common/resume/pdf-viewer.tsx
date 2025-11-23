import { Document, Page, pdfjs } from "react-pdf";
import { useCallback, useEffect, useMemo, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function highlightPattern(text: any, pattern: any) {
  return text.replace(pattern, (value: any) => `<mark>${value}</mark>`);
}

export default function ContainedPdfViewer({
  pdfUrl,
  containerRef,
}: {
  pdfUrl: string;
  containerRef: React.RefObject<HTMLElement>;
}) {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const searchText = "";

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  if (!pdfUrl || containerWidth === 0) return null;

  return (
    <Document file={pdfUrl} key={"resume-viewer"}>
      <Page
        key={containerWidth}
        pageNumber={1}
        width={containerWidth}
        renderTextLayer={true}
        renderAnnotationLayer={false}
        devicePixelRatio={10}
        canvasRef={null}
        // customTextRenderer={textRenderer}
      />
    </Document>
  );
}
