import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* SVG for Black Four Pointed Star (✦) */}
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 32 32"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16 0 Q19 13 32 16 Q19 19 16 32 Q13 19 0 16 Q13 13 16 0 Z" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
