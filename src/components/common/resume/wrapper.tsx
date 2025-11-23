import React, { ReactNode } from "react";

const Wrapper = ({
  children,
  buttons,
  buttonsWidth,
}: {
  children: ReactNode;
  buttons: ReactNode;
  buttonsWidth: number;
}) => {
  return (
    <div className="wrapper overflow-hidden w-[95vw] h-[95dvh] m-auto z-10 rounded-md relative">
      <div
        className="top-left-mask inverted-radius-top-left absolute w-full h-full "
        style={
          {
            "--r": "10px",
            "--stl": "10px",
            "--xtl": "8px",
            "--ytl": "35px",
          } as React.CSSProperties
        }
      >
        <div
          className="bottom-right-mask inverted-radius-bottom-right absolute w-full h-full bg-white/20 flex items-center justify-center"
          style={
            {
              "--r": "10px",
              "--sbr": "12px",
              "--xbr": `${buttonsWidth - 20}px`,
              "--ybr": "15px",
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
      {/* bottom buttons */}
      {buttons}
    </div>
  );
};

export default Wrapper;
