'use client';

import { useState, useCallback } from 'react';
import { BallTrajectory, SpinType, PlayerSide, StrokeType } from '@/lib/types';
import { PLAYER_COLORS, SPIN_COLORS, SPIN_DASH_ARRAYS } from '@/lib/constants';
import { Button, Card } from '@/components/ui';

interface DiagramEditorProps {
  trajectories: BallTrajectory[];
  onChange: (trajectories: BallTrajectory[]) => void;
}

type EditMode = 'select' | 'add-start' | 'add-end';

interface PendingTrajectory {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  type: SpinType;
  player: PlayerSide;
  stroke?: StrokeType;
}

interface DragState {
  trajectoryId: string;
  point: 'start' | 'end';
}

export function DiagramEditor({ trajectories, onChange }: DiagramEditorProps) {
  const [editMode, setEditMode] = useState<EditMode>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pending, setPending] = useState<PendingTrajectory>({
    type: 'topspin',
    player: 'self',
    stroke: 'VH',
  });

  // SVG-Koordinaten zu Prozent konvertieren
  const svgToPercent = (svgX: number, svgY: number) => {
    const x = Math.round(((svgX - 10) / 180) * 100);
    const y = Math.round(((svgY - 10) / 330) * 100);
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  // Prozent zu SVG-Koordinaten
  const percentToSvg = (x: number, y: number) => ({
    x: 10 + (x / 100) * 180,
    y: 10 + (y / 100) * 330,
  });

  // Konvertiere Maus-Event zu SVG-Koordinaten
  const eventToSvgCoords = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 200 / rect.width;
    const scaleY = 350 / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    return svgToPercent(svgX, svgY);
  }, []);

  // Klick auf SVG
  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Ignoriere Clicks während Drag
    if (dragState) return;

    const { x, y } = eventToSvgCoords(e);

    if (editMode === 'add-start') {
      setPending(prev => ({ ...prev, startX: x, startY: y }));
      setEditMode('add-end');
    } else if (editMode === 'add-end') {
      const newTrajectory: BallTrajectory = {
        id: 't' + Date.now().toString(36),
        startX: pending.startX!,
        startY: pending.startY!,
        endX: x,
        endY: y,
        type: pending.type,
        player: pending.player,
        stroke: pending.stroke,
        order: trajectories.length + 1,
      };
      onChange([...trajectories, newTrajectory]);
      setEditMode('select');
      setPending({
        type: pending.type,
        player: pending.player,
        stroke: pending.stroke,
      });
    }
  }, [editMode, pending, trajectories, onChange, dragState, eventToSvgCoords]);

  // Start Drag
  const handleDragStart = useCallback((trajectoryId: string, point: 'start' | 'end', e: React.MouseEvent) => {
    e.stopPropagation();
    if (editMode !== 'select') return;
    setDragState({ trajectoryId, point });
    setSelectedId(trajectoryId);
  }, [editMode]);

  // Drag Move
  const handleDragMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragState) return;

    const { x, y } = eventToSvgCoords(e);
    const trajectory = trajectories.find(t => t.id === dragState.trajectoryId);
    if (!trajectory) return;

    const updates: Partial<BallTrajectory> = {};
    if (dragState.point === 'start') {
      updates.startX = x;
      updates.startY = y;
    } else {
      updates.endX = x;
      updates.endY = y;
    }

    onChange(trajectories.map(t => t.id === dragState.trajectoryId ? { ...t, ...updates } : t));
  }, [dragState, trajectories, onChange, eventToSvgCoords]);

  // End Drag
  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, []);

  // Trajektorie löschen
  const handleDelete = (id: string) => {
    const updated = trajectories
      .filter(t => t.id !== id)
      .map((t, i) => ({ ...t, order: i + 1 }));
    onChange(updated);
    setSelectedId(null);
  };

  // Trajektorie nach oben/unten verschieben
  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const index = trajectories.findIndex(t => t.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === trajectories.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...trajectories];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated.map((t, i) => ({ ...t, order: i + 1 })));
  };

  // Trajektorie bearbeiten
  const handleUpdate = (id: string, updates: Partial<BallTrajectory>) => {
    onChange(trajectories.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // Berechne Bezier-Kontrollpunkt
  const calculateControlPoint = (startX: number, startY: number, endX: number, endY: number, type: SpinType) => {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const curveOffset = type === 'topspin' ? -15 : type === 'backspin' ? 10 : 0;
    return { cx: midX, cy: midY + curveOffset };
  };

  const selectedTrajectory = trajectories.find(t => t.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div>
        <Card variant="glass" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Diagramm-Editor</h3>
            <div className="flex gap-2">
              <Button
                variant={editMode === 'select' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setEditMode('select')}
              >
                Auswählen
              </Button>
              <Button
                variant={editMode.startsWith('add') ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setEditMode('add-start')}
              >
                + Hinzufügen
              </Button>
            </div>
          </div>

          {/* Modus-Anzeige */}
          {editMode !== 'select' && (
            <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-blue-700 font-medium">
                {editMode === 'add-start' && 'Klicke auf den Startpunkt des Pfeils'}
                {editMode === 'add-end' && 'Klicke auf den Endpunkt des Pfeils'}
              </p>
            </div>
          )}

          {/* Neue Trajektorie Einstellungen */}
          {editMode !== 'select' && (
            <div className="mb-4 p-3 glass-dark rounded-xl space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Spieler
                  </label>
                  <select
                    value={pending.player}
                    onChange={e => setPending(prev => ({ ...prev, player: e.target.value as PlayerSide }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="self">Spieler (unten)</option>
                    <option value="opponent">Gegner (oben)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Schlagtyp
                  </label>
                  <select
                    value={pending.type}
                    onChange={e => setPending(prev => ({ ...prev, type: e.target.value as SpinType }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="topspin">Topspin</option>
                    <option value="backspin">Unterschnitt</option>
                    <option value="block">Block</option>
                    <option value="flat">Flach</option>
                    <option value="sidespin">Sidespin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                  Schlag
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPending(prev => ({ ...prev, stroke: 'VH' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pending.stroke === 'VH'
                        ? (pending.player === 'self' ? 'bg-red-500' : 'bg-blue-500') + ' text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={pending.stroke !== 'VH' ? { color: 'var(--text-primary)' } : {}}
                  >
                    VH
                  </button>
                  <button
                    onClick={() => setPending(prev => ({ ...prev, stroke: 'RH' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pending.stroke === 'RH'
                        ? (pending.player === 'self' ? 'bg-red-500' : 'bg-blue-500') + ' text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={pending.stroke !== 'RH' ? { color: 'var(--text-primary)' } : {}}
                  >
                    RH
                  </button>
                  <button
                    onClick={() => setPending(prev => ({ ...prev, stroke: 'BL' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pending.stroke === 'BL'
                        ? (pending.player === 'self' ? 'bg-red-500' : 'bg-blue-500') + ' text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={pending.stroke !== 'BL' ? { color: 'var(--text-primary)' } : {}}
                  >
                    BL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SVG Editor */}
          <div className="relative">
            <svg
              viewBox="0 0 200 350"
              className="w-full max-w-xs mx-auto cursor-crosshair"
              style={{ aspectRatio: '200/350', cursor: dragState ? 'grabbing' : 'crosshair' }}
              onClick={handleSvgClick}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {/* Pfeilspitzen-Definitionen */}
              <defs>
                <marker
                  id="arrow-self"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={PLAYER_COLORS.self} />
                </marker>
                <marker
                  id="arrow-opponent"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={PLAYER_COLORS.opponent} />
                </marker>
              </defs>

              {/* Tisch-Rahmen */}
              <rect x="5" y="5" width="190" height="340" rx="4" fill="#8B4513" />
              <rect x="10" y="10" width="180" height="330" rx="2" fill="#1a5f2a" />
              <rect x="12" y="12" width="176" height="326" rx="1" fill="none" stroke="white" strokeWidth="2" />
              <line x1="100" y1="12" x2="100" y2="338" stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
              <line x1="5" y1="175" x2="195" y2="175" stroke="#333" strokeWidth="3" />
              <line x1="5" y1="173" x2="195" y2="173" stroke="white" strokeWidth="1" />
              <rect x="2" y="170" width="6" height="10" fill="#444" rx="1" />
              <rect x="192" y="170" width="6" height="10" fill="#444" rx="1" />

              {/* Trajektorien */}
              {trajectories.map((t) => {
                const start = percentToSvg(t.startX, t.startY);
                const end = percentToSvg(t.endX, t.endY);
                const control = calculateControlPoint(start.x, start.y, end.x, end.y, t.type);
                const color = t.player ? PLAYER_COLORS[t.player] : SPIN_COLORS[t.type];
                const isSelected = t.id === selectedId;
                const isDragging = dragState?.trajectoryId === t.id;

                return (
                  <g key={t.id}>
                    <g
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editMode === 'select' && !dragState) setSelectedId(t.id);
                      }}
                      style={{ cursor: editMode === 'select' ? 'pointer' : 'crosshair' }}
                    >
                      {/* Highlight bei Auswahl */}
                      {isSelected && (
                        <path
                          d={`M ${start.x} ${start.y} Q ${control.cx} ${control.cy} ${end.x} ${end.y}`}
                          fill="none"
                          stroke="white"
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                      )}
                      {/* Pfad mit Pfeilspitze */}
                      <path
                        d={`M ${start.x} ${start.y} Q ${control.cx} ${control.cy} ${end.x} ${end.y}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeDasharray={SPIN_DASH_ARRAYS[t.type]}
                        strokeLinecap="round"
                        markerEnd={`url(#arrow-${t.player || 'self'})`}
                        opacity={isSelected ? 1 : 0.8}
                      />
                      {/* Start-Marker für Spieler (self): Nummer + VH/RH/BL */}
                      {t.player === 'self' && (
                        <g>
                          {/* Nummer oben links */}
                          {t.order && (
                            <>
                              <circle cx={start.x - 12} cy={start.y - 12} r="6" fill="white" stroke={color} strokeWidth="1.5" />
                              <text x={start.x - 12} y={start.y - 12} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="bold" fill={color}>
                                {t.order}
                              </text>
                            </>
                          )}
                          {/* Schlagtyp (VH/RH/BL) */}
                          {t.stroke && (
                            <>
                              <rect x={start.x - 10} y={start.y - 7} width="20" height="14" rx="3" fill="white" stroke={color} strokeWidth="1.5" />
                              <text x={start.x} y={start.y} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="bold" fill={color}>
                                {t.stroke}
                              </text>
                            </>
                          )}
                        </g>
                      )}
                      {/* Start-Marker für Gegner (opponent): Nummer + VH/RH/BL */}
                      {t.player === 'opponent' && (
                        <g>
                          {/* Nummer im Kreis */}
                          <circle cx={start.x} cy={start.y} r="6" fill="white" stroke={color} strokeWidth="1.5" />
                          <text x={start.x} y={start.y} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="bold" fill={color}>
                            {t.order || 1}
                          </text>
                          {/* Schlagtyp (VH/RH/BL) unterhalb */}
                          {t.stroke && (
                            <>
                              <rect x={start.x - 10} y={start.y + 8} width="20" height="12" rx="3" fill="white" stroke={color} strokeWidth="1.5" />
                              <text x={start.x} y={start.y + 14} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="bold" fill={color}>
                                {t.stroke}
                              </text>
                            </>
                          )}
                        </g>
                      )}
                    </g>

                    {/* Drag-Handles (nur im Select-Modus und wenn ausgewählt) */}
                    {editMode === 'select' && isSelected && (
                      <g>
                        {/* Start-Handle */}
                        <circle
                          cx={start.x}
                          cy={start.y}
                          r="8"
                          fill="white"
                          stroke={color}
                          strokeWidth="2.5"
                          style={{ cursor: 'grab' }}
                          opacity={isDragging && dragState.point === 'start' ? 0.8 : 1}
                          onMouseDown={(e) => handleDragStart(t.id, 'start', e)}
                        />
                        <circle
                          cx={start.x}
                          cy={start.y}
                          r="3"
                          fill={color}
                          style={{ pointerEvents: 'none' }}
                        />

                        {/* End-Handle */}
                        <circle
                          cx={end.x}
                          cy={end.y}
                          r="8"
                          fill="white"
                          stroke={color}
                          strokeWidth="2.5"
                          style={{ cursor: 'grab' }}
                          opacity={isDragging && dragState.point === 'end' ? 0.8 : 1}
                          onMouseDown={(e) => handleDragStart(t.id, 'end', e)}
                        />
                        <circle
                          cx={end.x}
                          cy={end.y}
                          r="3"
                          fill={color}
                          style={{ pointerEvents: 'none' }}
                        />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Pending Start-Punkt */}
              {editMode === 'add-end' && pending.startX !== undefined && (
                <circle
                  cx={percentToSvg(pending.startX, pending.startY!).x}
                  cy={percentToSvg(pending.startX, pending.startY!).y}
                  r="6"
                  fill={pending.player === 'self' ? PLAYER_COLORS.self : PLAYER_COLORS.opponent}
                  stroke="white"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* Legende */}
          <div className="mt-4 flex justify-center gap-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAYER_COLORS.self }} />
              <span>Spieler</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAYER_COLORS.opponent }} />
              <span>Gegner</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Trajektorien-Liste */}
      <div>
        <Card variant="glass" className="p-4">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Trajektorien ({trajectories.length})
          </h3>

          {trajectories.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              Keine Trajektorien. Klicke auf &quot;+ Hinzufügen&quot; um eine neue zu erstellen.
            </p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {trajectories.map((t, index) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl glass-dark flex items-center gap-3 ${
                    selectedId === t.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedId(t.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Reihenfolge */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: t.player ? PLAYER_COLORS[t.player] + '20' : SPIN_COLORS[t.type] + '20',
                      color: t.player ? PLAYER_COLORS[t.player] : SPIN_COLORS[t.type],
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {t.player === 'self' ? 'Spieler' : 'Gegner'}: {t.type}
                      {t.stroke && ` (${t.stroke})`}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ({t.startX}, {t.startY}) → ({t.endX}, {t.endY})
                    </p>
                  </div>

                  {/* Aktionen */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReorder(t.id, 'up'); }}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-white/20 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReorder(t.id, 'down'); }}
                      disabled={index === trajectories.length - 1}
                      className="p-1.5 rounded hover:bg-white/20 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bearbeiten-Panel */}
          {selectedTrajectory && (
            <div className="mt-4 p-4 glass-dark rounded-xl border border-blue-500/30">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Trajektorie bearbeiten
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Spieler</label>
                  <select
                    value={selectedTrajectory.player || 'self'}
                    onChange={e => handleUpdate(selectedId!, { player: e.target.value as PlayerSide })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="self">Spieler</option>
                    <option value="opponent">Gegner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Schlag</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(selectedId!, { stroke: 'VH' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTrajectory.stroke === 'VH'
                          ? (selectedTrajectory.player === 'self' ? 'bg-red-500' : 'bg-blue-500') + ' text-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      style={selectedTrajectory.stroke !== 'VH' ? { color: 'var(--text-primary)' } : {}}
                    >
                      VH
                    </button>
                    <button
                      onClick={() => handleUpdate(selectedId!, { stroke: 'RH' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTrajectory.stroke === 'RH'
                          ? (selectedTrajectory.player === 'self' ? 'bg-red-500' : 'bg-blue-500') + ' text-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      style={selectedTrajectory.stroke !== 'RH' ? { color: 'var(--text-primary)' } : {}}
                    >
                      RH
                    </button>
                    <button
                      onClick={() => handleUpdate(selectedId!, { stroke: 'BL' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTrajectory.stroke === 'BL'
                          ? (selectedTrajectory.player === 'self' ? 'bg-red-500' : 'bg-blue-500') + ' text-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      style={selectedTrajectory.stroke !== 'BL' ? { color: 'var(--text-primary)' } : {}}
                    >
                      BL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
