import { motion } from "motion/react";

import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import ContainedPdfViewer from "./pdf-viewer";
import Wrapper from "./wrapper";

const ResumeViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [changed, setChanged] = useState(true);
  const [canvasApi, setCanvasApi] = useState<ReactZoomPanPinchRef>();

  const [position, setPosition] = useState<{ x: number; y: number }>();

  const resetView = async () => {
    await canvasApi?.centerView();
    setChanged(true);
  };

  return (
    <Wrapper
      buttonsWidth={320}
      buttons={
        <div className="buttons w-[320px] h-[35px] absolute bottom-0 right-0 flex gap-1 items-center justify-around z-[10] p-1"></div>
      }
    >
      <TransformWrapper
        centerZoomedOut
        smooth
        centerOnInit
        onInit={(e) => setCanvasApi(e)}
        wheel={{ step: 100, disabled: true }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        onPanning={(_) => setChanged(false)}
      >
        <div className="wrapper w-full h-full relative">
          <motion.div
            layout
            className="centered absolute bg-white/10 rounded-full px-3 py-1 z-[999] text-white shadow mix-blend-difference cursor-pointer left-[50%] translate-x-[-50%] text-sm flex gap-1 items-center justify-center brightness-150"
            onClick={resetView}
            initial={{
              translateY: "-150%",
            }}
            animate={{
              translateY: changed ? "-150%" : "100%",
            }}
          >
            <IoClose />
            <span className="-translate-y-0.5">Reset</span>
          </motion.div>
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentClass="resume aspect-[8.27/11] bg-white rounded-md overflow-hidden relative"
            contentStyle={{
              height: "80%",
              width: "unset",
            }}
          >
            {position && (
              <div
                className="w-1 aspect-square bg-red-500 rounded-full absolute z-[999] translate-y-[-50%] translate-x-[-50%]"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
              ></div>
            )}
            <div
              className="w-full h-full flex items-center justify-center"
              ref={containerRef}
            >
              <ContainedPdfViewer
                containerRef={containerRef}
                pdfUrl={"https://www.orimi.com/pdf-test.pdf"}
              />
            </div>
          </TransformComponent>
        </div>
      </TransformWrapper>
    </Wrapper>
  );
};

export default ResumeViewer;
