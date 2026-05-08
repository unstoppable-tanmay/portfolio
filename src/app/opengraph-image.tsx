import { TANMAY } from '@/data/portfolio';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Tanmay Kumar - Software Engineer';
export const size = { width: 1800, height: 900 };
export const contentType = 'image/png';

export default async function Image() {
  const data = TANMAY;

  // Use edge-compatible fetch to load the local SVG and font
  const svgText = await fetch(
    new URL('../../public/images/me.svg', import.meta.url)
  ).then((res) => res.text());

  const poppinsBold = await fetch(
    new URL('../../public/fonts/Poppins-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  // Convert SVG text to base64 Data URI
  const logoSrc = `data:image/svg+xml;base64,${btoa(svgText)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1800px',
          height: '900px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          fontFamily: 'Poppins',
        }}
      >
        <p style={{
          fontSize: '80px',
          fontWeight: 700,
          color: '#333333',
          margin: 0,
        }}>Engineer.</p>

        <div
          style={{
            display: 'flex',
            position: 'relative',
            height: '450px',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '40px 0',
          }}
        >
          <img
            src={logoSrc}
            style={{
              height: '850px',
              objectFit: 'contain',
            }}
          />
        </div>

        <p style={{
          fontSize: '80px',
          fontWeight: 700,
          color: '#333333',
          margin: 0,
        }}>Tanmay</p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Poppins',
          data: poppinsBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
