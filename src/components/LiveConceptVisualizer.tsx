import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Sparkles, Sliders, MessageSquare, Volume2, Eye, Info } from 'lucide-react';
import { LiveVisualizationConfig, VisualizationStep } from '../types';

interface LiveConceptVisualizerProps {
  config: LiveVisualizationConfig;
  topicId: string;
}

export const LiveConceptVisualizer: React.FC<LiveConceptVisualizerProps> = ({ config, topicId }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [scrubProgress, setScrubProgress] = useState<number>(0); // 0 to 100
  const [params, setParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.entries(config.initialParams).forEach(([k, v]) => {
      initial[k] = v.value;
    });
    return initial;
  });

  // AI Live visual Q&A state
  const [userQuery, setUserQuery] = useState<string>('');
  const [aiExplanation, setAiExplanation] = useState<string>(
    'Live AI Visualizer is running. Adjust any parameter on the right to see real-time dynamic feedback!'
  );
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Update parameters when config changes
  useEffect(() => {
    const initial: Record<string, number> = {};
    Object.entries(config.initialParams).forEach(([k, v]) => {
      initial[k] = v.value;
    });
    setParams(initial);
    setCurrentStepIdx(0);
    setScrubProgress(0);
    setIsPlaying(true);
  }, [config.id]);

  const handleParamChange = (key: string, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  // Step selection
  const selectStep = (idx: number) => {
    setCurrentStepIdx(idx);
    const step = config.steps[idx];
    if (step && step.parameterValues) {
      setParams((prev) => ({ ...prev, ...step.parameterValues }));
    }
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        timeRef.current += delta * speed;
        setScrubProgress((prev) => (prev + delta * 8 * speed) % 100);
      }

      // Resize canvas to display size for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Clear background
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, width, height);

      // Render domain specific simulation
      if (topicId === 'math_chain_rule') {
        renderChainRuleSimulation(ctx, width, height, timeRef.current, params);
      } else if (topicId === 'physics_snells_law') {
        renderSnellSimulation(ctx, width, height, timeRef.current, params);
      } else if (topicId === 'cs_bst_traversal') {
        renderBstSimulation(ctx, width, height, timeRef.current, params);
      } else {
        renderGenericWaveSimulation(ctx, width, height, timeRef.current, params);
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, speed, params, topicId]);

  // SIMULATION 1: Calculus Chain Rule Tandem Machine
  const renderChainRuleSimulation = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    p: Record<string, number>
  ) => {
    const xInput = p.xInput ?? 1.5;
    const innerSlope = p.innerSlope ?? 2.5;
    const outerExponent = p.outerExponent ?? 2;

    // Derived values
    const u = innerSlope * xInput;
    const y = Math.pow(u / 2, outerExponent);
    const dy_du = outerExponent * Math.pow(u / 2, outerExponent - 1) * 0.5;
    const du_dx = innerSlope;
    const total_dy_dx = dy_du * du_dx;

    // Title label on canvas
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('STAGE 1: Inner Function u = g(x)', 40, 30);
    ctx.fillText('STAGE 2: Outer Function y = f(u)', w / 2 + 30, 30);

    // Box 1: Inner Function (x -> u)
    const box1X = 30;
    const box1Y = 45;
    const box1W = w / 2 - 50;
    const box1H = h - 110;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#1e293b';
    roundRect(ctx, box1X, box1Y, box1W, box1H, 12);
    ctx.fill();
    ctx.stroke();

    // Box 2: Outer Function (u -> y)
    const box2X = w / 2 + 20;
    const box2Y = 45;
    const box2W = w / 2 - 50;
    const box2H = h - 110;

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#1e293b';
    roundRect(ctx, box2X, box2Y, box2W, box2H, 12);
    ctx.fill();
    ctx.stroke();

    // Connector coupling pipe from Box 1 to Box 2
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(box1X + box1W, box1Y + box1H / 2);
    ctx.lineTo(box2X, box2Y + box2H / 2);
    ctx.stroke();

    // Animated packet flowing from 1 to 2
    const flowT = (t * 2) % 1;
    const packetX = box1X + box1W + flowT * (box2X - (box1X + box1W));
    const packetY = box1Y + box1H / 2;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(packetX, packetY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Box 1 Internal: Rotating Gear 1 (g'(x) rate)
    const gear1CX = box1X + box1W / 2;
    const gear1CY = box1Y + box1H / 2;
    drawGear(ctx, gear1CX, gear1CY, 36, t * innerSlope * 2, '#38bdf8', '#0284c7');

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`x = ${xInput.toFixed(2)}`, gear1CX, box1Y + 30);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px system-ui';
    ctx.fillText(`Inner rate du/dx = ${du_dx.toFixed(2)}`, gear1CX, box1Y + box1H - 25);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`u output = ${u.toFixed(2)}`, gear1CX, box1Y + box1H - 10);

    // Box 2 Internal: Rotating Gear 2 (f'(u) rate)
    const gear2CX = box2X + box2W / 2;
    const gear2CY = box2Y + box2H / 2;
    drawGear(ctx, gear2CX, gear2CY, 42, -t * innerSlope * dy_du * 0.8, '#c084fc', '#9333ea');

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px system-ui';
    ctx.fillText(`u input = ${u.toFixed(2)}`, gear2CX, box2Y + 30);
    ctx.fillStyle = '#c084fc';
    ctx.font = '12px system-ui';
    ctx.fillText(`Outer rate dy/du = ${dy_du.toFixed(2)}`, gear2CX, box2Y + box2H - 25);
    ctx.fillStyle = '#facc15';
    ctx.fillText(`y output = ${y.toFixed(2)}`, gear2CX, box2Y + box2H - 10);

    // Bottom banner: Combined Chain Rule Multiplication result
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, h - 50, w - 40, 40);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(20, h - 50, w - 40, 40);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(
      `Chain Rule: dy/dx = (dy/du) × (du/dx) = ${dy_du.toFixed(2)} × ${du_dx.toFixed(2)} = ${total_dy_dx.toFixed(2)}`,
      35,
      h - 25
    );
  };

  // SIMULATION 2: Physics Snell's Law & Wavefront Deceleration
  const renderSnellSimulation = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    p: Record<string, number>
  ) => {
    const angle1Deg = p.angleIncidence ?? 35;
    const n1 = p.n1 ?? 1.0;
    const n2 = p.n2 ?? 1.5;

    const angle1Rad = (angle1Deg * Math.PI) / 180;
    const sinAngle2 = (n1 * Math.sin(angle1Rad)) / n2;
    const isTir = sinAngle2 > 1.0; // Total internal reflection check
    const angle2Rad = isTir ? 0 : Math.asin(sinAngle2);
    const angle2Deg = isTir ? 90 : (angle2Rad * 180) / Math.PI;

    const boundaryY = h / 2;

    // Medium 1 (Top)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, boundaryY);

    // Medium 2 (Bottom)
    ctx.fillStyle = '#1e1b4b'; // deep indigo
    ctx.fillRect(0, boundaryY, w, h - boundaryY);

    // Boundary interface line
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, boundaryY);
    ctx.lineTo(w, boundaryY);
    ctx.stroke();

    // Normal line (dashed)
    const normalX = w / 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(normalX, 20);
    ctx.lineTo(normalX, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Medium labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`Medium 1 (n₁ = ${n1.toFixed(2)}) - Speed v₁ = c/${n1.toFixed(2)}`, 20, 30);
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText(
      `Medium 2 (n₂ = ${n2.toFixed(2)}) - Speed v₂ = c/${n2.toFixed(2)} ${n2 > n1 ? '(Slower & Denser)' : '(Faster)'}`,
      20,
      boundaryY + 30
    );

    // Incident Ray
    const rayLen = 140;
    const rayStartX = normalX - rayLen * Math.sin(angle1Rad);
    const rayStartY = boundaryY - rayLen * Math.cos(angle1Rad);

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rayStartX, rayStartY);
    ctx.lineTo(normalX, boundaryY);
    ctx.stroke();

    // Refracted or Reflected Ray
    if (!isTir) {
      const rayEndX = normalX + rayLen * Math.sin(angle2Rad);
      const rayEndY = boundaryY + rayLen * Math.cos(angle2Rad);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(normalX, boundaryY);
      ctx.lineTo(rayEndX, rayEndY);
      ctx.stroke();

      // Refracted angle arc
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(normalX, boundaryY, 35, Math.PI / 2 - angle2Rad, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px system-ui';
      ctx.fillText(`θ₂ = ${angle2Deg.toFixed(1)}°`, normalX + 10, boundaryY + 45);
    }

    // Incident angle arc
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(normalX, boundaryY, 40, -Math.PI / 2, -Math.PI / 2 + angle1Rad);
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.font = '11px system-ui';
    ctx.fillText(`θ₁ = ${angle1Deg}°`, normalX - 45, boundaryY - 20);

    // Animated marching wavefront crests!
    const waveSpeed1 = (60 / n1) * speed;
    const waveSpeed2 = (60 / n2) * speed;

    const numCrests = 5;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = 2;

    for (let i = 0; i < numCrests; i++) {
      const progress = ((t * waveSpeed1 + i * 35) % 175) / 175;
      const curDist = progress * rayLen;
      const cx = rayStartX + curDist * Math.sin(angle1Rad);
      const cy = rayStartY + curDist * Math.cos(angle1Rad);

      if (cy < boundaryY) {
        // Draw wavefront perpendicular to incident ray
        const perpAngle = angle1Rad + Math.PI / 2;
        const halfSpan = 25;
        ctx.beginPath();
        ctx.moveTo(cx - halfSpan * Math.sin(perpAngle), cy - halfSpan * Math.cos(perpAngle));
        ctx.lineTo(cx + halfSpan * Math.sin(perpAngle), cy + halfSpan * Math.cos(perpAngle));
        ctx.stroke();
      }
    }

    // Bottom formula telemetry
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, h - 45, w - 40, 36);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(20, h - 45, w - 40, 36);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(
      `Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂) → ${n1.toFixed(2)} × sin(${angle1Deg}°) = ${n2.toFixed(2)} × sin(${angle2Deg.toFixed(1)}°)`,
      30,
      h - 22
    );
  };

  // SIMULATION 3: Computer Science BST Call Stack & Decision Branch
  const renderBstSimulation = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    p: Record<string, number>
  ) => {
    const searchKey = p.searchKey ?? 35;

    // Fixed BST Node coordinates
    const nodes = [
      { id: 50, x: w / 3, y: 70, left: 25, right: 75, depth: 1 },
      { id: 25, x: w / 3 - 80, y: 140, left: 15, right: 35, depth: 2 },
      { id: 75, x: w / 3 + 80, y: 140, left: 60, right: 90, depth: 2 },
      { id: 15, x: w / 3 - 120, y: 210, depth: 3 },
      { id: 35, x: w / 3 - 40, y: 210, depth: 3 },
      { id: 60, x: w / 3 + 40, y: 210, depth: 3 },
      { id: 90, x: w / 3 + 120, y: 210, depth: 3 },
    ];

    // Determine path taken
    const path: number[] = [50];
    if (searchKey < 50) {
      path.push(25);
      if (searchKey < 25) path.push(15);
      else if (searchKey >= 25) path.push(35);
    } else {
      path.push(75);
      if (searchKey < 75) path.push(60);
      else path.push(90);
    }

    // Active node based on animation time cycle
    const cycle = Math.floor(t * 1.2) % (path.length + 1);
    const activeNodeId = cycle < path.length ? path[cycle] : path[path.length - 1];

    // Tree Lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    // 50 -> 25 & 75
    drawTreeEdge(ctx, nodes[0], nodes[1]);
    drawTreeEdge(ctx, nodes[0], nodes[2]);
    // 25 -> 15 & 35
    drawTreeEdge(ctx, nodes[1], nodes[3]);
    drawTreeEdge(ctx, nodes[1], nodes[4]);
    // 75 -> 60 & 90
    drawTreeEdge(ctx, nodes[2], nodes[5]);
    drawTreeEdge(ctx, nodes[2], nodes[6]);

    // Draw Nodes
    nodes.forEach((n) => {
      const isPath = path.includes(n.id);
      const isActive = n.id === activeNodeId;
      const isMatch = n.id === searchKey && isActive;

      ctx.beginPath();
      ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);

      if (isMatch) {
        ctx.fillStyle = '#10b981'; // Emerald match
        ctx.strokeStyle = '#34d399';
      } else if (isActive) {
        ctx.fillStyle = '#f59e0b'; // Amber inspecting
        ctx.strokeStyle = '#fbbf24';
      } else if (isPath) {
        ctx.fillStyle = '#1e3a8a'; // Traversed
        ctx.strokeStyle = '#3b82f6';
      } else {
        ctx.fillStyle = '#1e293b'; // Unvisited
        ctx.strokeStyle = '#475569';
      }
      ctx.lineWidth = isActive ? 3 : 1.5;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.id.toString(), n.x, n.y);
    });

    // Right Column: Live Call Stack Inspector
    const stackX = (w * 2) / 3 + 20;
    const stackY = 45;
    const stackW = w / 3 - 40;
    const stackH = h - 90;

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    roundRect(ctx, stackX, stackY, stackW, stackH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('ACTIVE CALL STACK', stackX + 15, stackY + 25);

    // Draw stack frames
    const currentStackFrames = path.slice(0, Math.min(cycle + 1, path.length));
    currentStackFrames.forEach((frameId, idx) => {
      const fy = stackY + 45 + idx * 45;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = idx === currentStackFrames.length - 1 ? '#f59e0b' : '#334155';
      ctx.lineWidth = 1.5;
      roundRect(ctx, stackX + 10, fy, stackW - 20, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px monospace';
      ctx.fillText(`search(node: ${frameId}, key: ${searchKey})`, stackX + 18, fy + 22);
    });

    // Bottom banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, h - 45, w - 40, 36);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(20, h - 45, w - 40, 36);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(
      `BST Search Target: ${searchKey} | Active Node: ${activeNodeId} | Decision: ${
        searchKey === activeNodeId
          ? 'FOUND! Return True'
          : searchKey < activeNodeId
          ? `${searchKey} < ${activeNodeId} → Recurse LEFT`
          : `${searchKey} > ${activeNodeId} → Recurse RIGHT`
      }`,
      30,
      h - 22
    );
  };

  const renderGenericWaveSimulation = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    p: Record<string, number>
  ) => {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Live Concept Visualizer Active', w / 2, h / 2);
  };

  // Helper drawing functions
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawGear(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    angle: number,
    fillColor: string,
    strokeColor: string
  ) {
    const teeth = 10;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i * 2 * Math.PI) / teeth;
      const aNext = ((i + 1) * 2 * Math.PI) / teeth;
      const rOuter = radius + 6;
      const rInner = radius;

      ctx.lineTo(Math.cos(a) * rInner, Math.sin(a) * rInner);
      ctx.lineTo(Math.cos(a + 0.1) * rOuter, Math.sin(a + 0.1) * rOuter);
      ctx.lineTo(Math.cos(a + 0.25) * rOuter, Math.sin(a + 0.25) * rOuter);
      ctx.lineTo(Math.cos(a + 0.35) * rInner, Math.sin(a + 0.35) * rInner);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center axle hole
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawTreeEdge(
    ctx: CanvasRenderingContext2D,
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Ask AI about current visual step
  const handleAskAiAboutVisual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsAiLoading(true);
    const activeStepLabel = config.steps[currentStepIdx]?.label || 'Active Visual Step';

    try {
      const res = await fetch('/api/explain-visual-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: config.concept,
          currentParams: params,
          stepLabel: activeStepLabel,
          userQuestion: userQuery,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || 'Visual explanation updated.');
      setUserQuery('');
    } catch (err) {
      setAiExplanation(
        `Observing "${activeStepLabel}": Modifying these parameters directly shifts the physical/mathematical output rates in real-time.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-100">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-tight">{config.title}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Real-Time AI Canvas
              </span>
            </div>
            <p className="text-xs text-slate-400">{config.summary}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              timeRef.current = 0;
              setScrubProgress(0);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset simulation time"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded ${
                  speed === s ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Visualizer Area: Canvas + Live Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Canvas Stage */}
        <div className="lg:col-span-8 p-4 flex flex-col items-center justify-center bg-slate-950/40 relative min-h-[360px]">
          <canvas
            ref={canvasRef}
            className="w-full h-[340px] rounded-xl border border-slate-800 shadow-inner bg-slate-900 block"
          />

          {/* Scrub Slider */}
          <div className="w-full mt-3 px-2 flex items-center space-x-3 text-xs text-slate-400">
            <span>Progress</span>
            <input
              type="range"
              min="0"
              max="100"
              value={scrubProgress}
              onChange={(e) => {
                const val = Number(e.target.value);
                setScrubProgress(val);
                timeRef.current = (val / 100) * 10;
              }}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-[11px] w-8">{Math.round(scrubProgress)}%</span>
          </div>
        </div>

        {/* Interactive Parameter Control Side Panel */}
        <div className="lg:col-span-4 p-4 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5 mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Controls</span>
            </h4>

            {/* Slider controls */}
            <div className="space-y-3.5">
              {Object.entries(config.initialParams).map(([key, def]) => {
                const currentVal = params[key] ?? def.value;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{def.label}</span>
                      <span className="font-mono font-bold text-indigo-300">
                        {currentVal}
                        {def.unit || ''}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={def.min}
                      max={def.max}
                      step={def.step}
                      value={currentVal}
                      onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Step Narration Selector */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Concept Progression Steps
              </span>
              <div className="space-y-1.5">
                {config.steps.map((st, idx) => (
                  <button
                    key={st.stepNumber}
                    onClick={() => selectStep(idx)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition border ${
                      currentStepIdx === idx
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold">{st.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{st.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200">
            <span className="font-bold block mb-0.5">💡 Interactive Hint:</span>
            {config.interactivePrompt}
          </div>
        </div>
      </div>

      {/* Synchronized AI Narration & Live Q&A Drawer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/70">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-indigo-600/30 border border-indigo-500 text-indigo-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Live AI Visual Explanation</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-mono">
                {config.steps[currentStepIdx]?.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiExplanation}</p>

            {/* Ask AI Input Field */}
            <form onSubmit={handleAskAiAboutVisual} className="mt-3 flex items-center space-x-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask AI why something is moving, or what a parameter represents..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isAiLoading || !userQuery.trim()}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition"
              >
                {isAiLoading ? 'Analyzing...' : 'Ask AI'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
