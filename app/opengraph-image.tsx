import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Green Collective — Sustainable Habits Dashboard'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#064e3b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(6, 95, 70, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6ee7b7',
              fontSize: '28px',
              fontWeight: 'bold',
            }}
          >
            🍃
          </div>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Green Collective
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
            }}
          >
            Turn today's habits into real climate impact.
          </div>
          <p style={{ fontSize: '24px', color: '#a7f3d0', margin: 0, fontWeight: '500' }}>
            Log sustainable habits, track CO2 savings, and join local collectives.
          </p>
        </div>

        {/* Footer Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            greencollective.ca
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
