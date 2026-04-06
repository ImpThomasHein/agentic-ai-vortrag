'use client';

import { BallTrajectory, PlayerSide } from '@/lib/types';
import { SPIN_COLORS, SPIN_DASH_ARRAYS, PLAYER_COLORS } from '@/lib/constants';

interface TableTennisDiagramProps {
  trajectories: BallTrajectory[];
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Berechnet Bezier-Kontrollpunkt für natürliche Ballkurve
function calculateControlPoint(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  type: BallTrajectory['type']
): { cx: number; cy: number } {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Kurve nach oben für Topspin, nach unten für Backspin
  const curveOffset = type === 'topspin' ? -15 : type === 'backspin' ? 10 : 0;

  return { cx: midX, cy: midY + curveOffset };
}

// Konvertiert Prozent-Koordinaten zu SVG-Koordinaten
function toSvgCoords(x: number, y: number) {
  // Tisch-Bereich: x: 10-190, y: 10-340
  const svgX = 10 + (x / 100) * 180;
  const svgY = 10 + (y / 100) * 330;
  return { x: svgX, y: svgY };
}

// Berechnet Pfeilspitzen-Winkel
function calculateArrowAngle(startX: number, startY: number, endX: number, endY: number): number {
  return Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
}

export default function TableTennisDiagram({
  trajectories,
  size = 'medium',
  className = '',
}: TableTennisDiagramProps) {
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-36',
    large: 'w-48',
  };

  return (
    <svg
      viewBox="0 0 200 350"
      className={`${sizeClasses[size]} ${className}`}
      style={{ aspectRatio: '200/350' }}
    >
      {/* Definitionen für Pfeilspitzen */}
      <defs>
        {/* Pfeile nach Spin-Typ */}
        {Object.entries(SPIN_COLORS).map(([spin, color]) => (
          <marker
            key={spin}
            id={`arrow-${spin}`}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill={color} />
          </marker>
        ))}
        {/* Pfeile nach Spieler-Seite */}
        {Object.entries(PLAYER_COLORS).map(([player, color]) => (
          <marker
            key={`player-${player}`}
            id={`arrow-player-${player}`}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill={color} />
          </marker>
        ))}
      </defs>

      {/* Tisch-Rahmen (braun) */}
      <rect
        x="5"
        y="5"
        width="190"
        height="340"
        rx="4"
        fill="#8B4513"
      />

      {/* Tischfläche (dunkelgrün) */}
      <rect
        x="10"
        y="10"
        width="180"
        height="330"
        rx="2"
        fill="#1a5f2a"
      />

      {/* Weiße Linien */}
      {/* Außenlinie */}
      <rect
        x="12"
        y="12"
        width="176"
        height="326"
        rx="1"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />

      {/* Mittellinie (längs) */}
      <line
        x1="100"
        y1="12"
        x2="100"
        y2="338"
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.6"
      />

      {/* Netz */}
      <line
        x1="5"
        y1="175"
        x2="195"
        y2="175"
        stroke="#333"
        strokeWidth="3"
      />
      <line
        x1="5"
        y1="173"
        x2="195"
        y2="173"
        stroke="white"
        strokeWidth="1"
      />

      {/* Netzpfosten (links und rechts) */}
      <rect x="2" y="170" width="6" height="10" fill="#444" rx="1" />
      <rect x="192" y="170" width="6" height="10" fill="#444" rx="1" />

      {/* Balltrajektorien */}
      {trajectories
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((trajectory, index) => {
          const start = toSvgCoords(trajectory.startX, trajectory.startY);
          const end = toSvgCoords(trajectory.endX, trajectory.endY);
          const control = calculateControlPoint(
            start.x,
            start.y,
            end.x,
            end.y,
            trajectory.type
          );

          // Farbe basierend auf Spieler-Seite oder Spin-Typ
          const color = trajectory.color ||
            (trajectory.player ? PLAYER_COLORS[trajectory.player] : SPIN_COLORS[trajectory.type]);
          const dashArray = SPIN_DASH_ARRAYS[trajectory.type];

          // Pfeilspitze basierend auf Spieler-Seite oder Spin-Typ
          const markerId = trajectory.player
            ? `arrow-player-${trajectory.player}`
            : `arrow-${trajectory.type}`;

          return (
            <g key={trajectory.id || index}>
              {/* Trajektorie als Bezier-Kurve */}
              <path
                d={`M ${start.x} ${start.y} Q ${control.cx} ${control.cy} ${end.x} ${end.y}`}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeDasharray={dashArray}
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
                opacity="0.9"
              />

              {/* Label für eigene Schläge (self): Nummer + Schlagtyp */}
              {trajectory.player === 'self' && (trajectory.stroke || trajectory.order) && (
                <g>
                  {/* Nummer oben links am Pfeilstart */}
                  {trajectory.order && (
                    <>
                      <circle
                        cx={start.x - 12}
                        cy={start.y - 12}
                        r="7"
                        fill="white"
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      <text
                        x={start.x - 12}
                        y={start.y - 12}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fontWeight="bold"
                        fill={color}
                      >
                        {trajectory.order}
                      </text>
                    </>
                  )}
                  {/* Schlagtyp (VH/RH/BL) am Pfeilstart */}
                  {trajectory.stroke && (
                    <>
                      <rect
                        x={start.x - 10}
                        y={start.y - 7}
                        width="20"
                        height="14"
                        rx="3"
                        fill="white"
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      <text
                        x={start.x}
                        y={start.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fontWeight="bold"
                        fill={color}
                      >
                        {trajectory.stroke}
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* Label für Gegner-Bälle (opponent): Nummer + Schlagtyp */}
              {trajectory.player === 'opponent' && (trajectory.order || trajectory.stroke) && (
                <g>
                  {/* Nummer im Kreis */}
                  {trajectory.order && (
                    <>
                      <circle
                        cx={start.x}
                        cy={start.y}
                        r="8"
                        fill="white"
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      <text
                        x={start.x}
                        y={start.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="10"
                        fontWeight="bold"
                        fill={color}
                      >
                        {trajectory.order}
                      </text>
                    </>
                  )}
                  {/* Schlagtyp (VH/RH/BL) unterhalb der Nummer */}
                  {trajectory.stroke && (
                    <>
                      <rect
                        x={start.x - 10}
                        y={start.y + (trajectory.order ? 10 : -7)}
                        width="20"
                        height="14"
                        rx="3"
                        fill="white"
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      <text
                        x={start.x}
                        y={start.y + (trajectory.order ? 17 : 0)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fontWeight="bold"
                        fill={color}
                      >
                        {trajectory.stroke}
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* Nummer bei Multi-Ball-Übungen (Legacy ohne player-Feld) */}
              {!trajectory.player && trajectory.order && (
                <g>
                  <circle
                    cx={start.x}
                    cy={start.y}
                    r="8"
                    fill="white"
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={start.x}
                    y={start.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fontWeight="bold"
                    fill={color}
                  >
                    {trajectory.order}
                  </text>
                </g>
              )}
            </g>
          );
        })}

      {/* Spieler-Indikator (Nahe Seite) */}
      <circle cx="100" cy="360" r="0" fill="#666" opacity="0" />
    </svg>
  );
}
