import React, { useState, useRef, useEffect } from 'react';
import { X, Info, CheckCircle, Clock, AlertTriangle, Maximize, Minimize, Shuffle } from 'lucide-react';
import { StudentMasteryGraph } from '../types/student';

interface KnowledgeGraphProps {
  studentData: StudentMasteryGraph;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: string[];
  prerequisites: string[];
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  studentData, 
  onClose, 
  isFullscreen = false, 
  onToggleFullscreen 
}) => {
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1200, height: 500 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([
    { 
      id: 'basic_forces', 
      name: 'Basic Forces', 
      x: 100, 
      y: 250, 
      vx: 0,
      vy: 0,
      connections: ['balanced_unbalanced_forces', 'friction'],
      prerequisites: []
    },
    { 
      id: 'balanced_unbalanced_forces', 
      name: 'Balanced/Unbalanced Forces', 
      x: 300, 
      y: 200, 
      vx: 0,
      vy: 0,
      connections: ['inertia_concept', 'equilibrium'],
      prerequisites: ['basic_forces']
    },
    { 
      id: 'inertia_concept', 
      name: 'Inertia Concept', 
      x: 500, 
      y: 250, 
      vx: 0,
      vy: 0,
      connections: ['newtons_first_law', 'mass_inertia_relationship', 'resistance_to_change'],
      prerequisites: ['balanced_unbalanced_forces']
    },
    { 
      id: 'mass_inertia_relationship', 
      name: 'Mass-Inertia Relationship', 
      x: 400, 
      y: 380, 
      vx: 0,
      vy: 0,
      connections: ['newtons_first_law', 'weight_vs_mass'],
      prerequisites: ['inertia_concept']
    },
    { 
      id: 'newtons_first_law', 
      name: "Newton's First Law", 
      x: 700, 
      y: 200, 
      vx: 0,
      vy: 0,
      connections: ['newtons_second_law', 'law_of_inertia'],
      prerequisites: ['inertia_concept', 'mass_inertia_relationship']
    },
    { 
      id: 'newtons_second_law', 
      name: "Newton's Second Law", 
      x: 900, 
      y: 250, 
      vx: 0,
      vy: 0,
      connections: ['momentum', 'force_acceleration'],
      prerequisites: ['newtons_first_law']
    },
    { 
      id: 'momentum', 
      name: 'Momentum', 
      x: 1000, 
      y: 380, 
      vx: 0,
      vy: 0,
      connections: ['conservation_momentum'],
      prerequisites: ['newtons_second_law']
    },
    // Related concept nodes (smaller, different style)
    { 
      id: 'friction', 
      name: 'Friction', 
      x: 150, 
      y: 380, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    },
    { 
      id: 'equilibrium', 
      name: 'Equilibrium', 
      x: 350, 
      y: 120, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    },
    { 
      id: 'resistance_to_change', 
      name: 'Resistance to Change', 
      x: 550, 
      y: 380, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    },
    { 
      id: 'weight_vs_mass', 
      name: 'Weight vs Mass', 
      x: 300, 
      y: 450, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    },
    { 
      id: 'law_of_inertia', 
      name: 'Law of Inertia', 
      x: 750, 
      y: 120, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    },
    { 
      id: 'force_acceleration', 
      name: 'Force & Acceleration', 
      x: 950, 
      y: 120, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    },
    { 
      id: 'conservation_momentum', 
      name: 'Conservation of Momentum', 
      x: 1100, 
      y: 450, 
      vx: 0,
      vy: 0,
      connections: [],
      prerequisites: []
    }
  ]);

  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  // Update viewBox when fullscreen changes
  useEffect(() => {
    if (isFullscreen) {
      setViewBox({ x: 0, y: 0, width: 1200, height: 500 });
      setZoom(1);
      setTargetZoom(1);
    } else {
      setViewBox({ x: 0, y: 0, width: 1200, height: 500 });
      setZoom(1);
      setTargetZoom(1);
    }
  }, [isFullscreen]);

  // Smooth zoom animation
  useEffect(() => {
    if (Math.abs(zoom - targetZoom) > 0.01) {
      setIsZooming(true);
      const animate = () => {
        setZoom(prevZoom => {
          const diff = targetZoom - prevZoom;
          const newZoom = prevZoom + diff * 0.15; // Smooth easing
          
          if (Math.abs(targetZoom - newZoom) < 0.01) {
            setIsZooming(false);
            return targetZoom;
          }
          
          // Update viewBox for center-based zoom
          setViewBox(prev => {
            const centerX = prev.x + prev.width / 2;
            const centerY = prev.y + prev.height / 2;
            const newWidth = 1200 / newZoom;
            const newHeight = 500 / newZoom;
            
            return {
              x: centerX - newWidth / 2,
              y: centerY - newHeight / 2,
              width: newWidth,
              height: newHeight
            };
          });
          
          return newZoom;
        });
        
        if (isZooming) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetZoom, isZooming]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const svgX = ((e.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x) / zoom;
    const svgY = ((e.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y) / zoom;

    setDraggedNode(nodeId);
    setDragOffset({
      x: svgX - node.x,
      y: svgY - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - (deltaX * (prev.width / rect.width)),
        y: prev.y - (deltaY * (prev.height / rect.height))
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!draggedNode) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const svgX = ((e.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x) / zoom;
    const svgY = ((e.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y) / zoom;

    const newX = Math.max(50, Math.min(1150, svgX - dragOffset.x));
    const newY = Math.max(50, Math.min(450, svgY - dragOffset.y));

    setNodes(prev => prev.map(node => 
      node.id === draggedNode 
        ? { ...node, x: newX, y: newY }
        : node
    ));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
    setIsPanning(false);
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (draggedNode) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newTargetZoom = Math.max(0.5, Math.min(3, targetZoom * zoomFactor));
    
    if (newTargetZoom !== targetZoom) {
      setTargetZoom(newTargetZoom);
    }
  };

  const resetView = () => {
    setViewBox({ x: 0, y: 0, width: 1200, height: 500 });
    setZoom(1);
    setTargetZoom(1);
  };

  const getNodeColor = (conceptId: string) => {
    const concept = studentData[conceptId];
    if (!concept) return { bg: '#9CA3AF', border: '#6B7280', icon: AlertTriangle };
    
    switch (concept.visualStatus) {
      case 'green':
        return { bg: '#00FF88', border: '#000000', icon: CheckCircle };
      case 'yellow':
        return { bg: '#FBBF24', border: '#000000', icon: Clock };
      case 'red':
        return { bg: '#FF0080', border: '#000000', icon: AlertTriangle };
      default:
        return { bg: '#9CA3AF', border: '#6B7280', icon: AlertTriangle };
    }
  };

  return (
    <React.Fragment>
      {isFullscreen ? (
        // True fullscreen modal that covers everything
        <div className="fixed inset-0 z-50 bg-pure-black flex flex-col">
          {/* Overlay Controls - Auto-hide */}
          <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } pointer-events-none`}>
            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 pointer-events-auto">
              <button
                onClick={resetView}
                className="px-3 py-2 bg-pure-white/90 backdrop-blur-sm text-pure-black font-mono font-bold text-xs border-2 border-pure-black hover:bg-neon-green transition-all duration-200"
              >
                RESET VIEW
              </button>
              <button
                onClick={onToggleFullscreen}
                className="px-3 py-2 bg-pure-white/90 backdrop-blur-sm text-pure-black font-mono font-bold text-xs border-2 border-pure-black hover:bg-neon-green transition-all duration-200"
              >
                <Minimize className="w-4 h-4 mr-1 inline" />
                EXIT
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 bg-hot-pink/90 backdrop-blur-sm text-pure-white font-mono font-bold text-xs border-2 border-pure-black hover:bg-pure-white hover:text-pure-black transition-all duration-200"
              >
                <X className="w-4 h-4 mr-1 inline" />
                CLOSE
              </button>
            </div>

            {/* Top-left Legend */}
            <div className="absolute top-4 left-4 bg-neon-green/90 backdrop-blur-sm border-2 border-pure-black p-3 pointer-events-auto">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-pure-black mr-1" strokeWidth={3} />
                  <span className="text-pure-black font-mono font-bold">STRONG</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-pure-black mr-1" strokeWidth={3} />
                  <span className="text-pure-black font-mono font-bold">DEVELOPING</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-pure-black mr-1" strokeWidth={3} />
                  <span className="text-pure-black font-mono font-bold">NEEDS WORK</span>
                </div>
              </div>
            </div>

            {/* Bottom Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-electric-blue/90 backdrop-blur-sm border-2 border-pure-black px-4 py-2 pointer-events-auto">
              <p className="text-pure-white font-mono font-bold text-xs text-center">
                🔍 ZOOM: {Math.round(zoom * 100)}% • SCROLL TO ZOOM • DRAG TO PAN • DRAG NODES TO REPOSITION
              </p>
            </div>
          </div>

          {/* Full Screen Graph */}
          <div className="flex-1 w-full h-full relative z-0">
            <svg 
              ref={svgRef}
              className="w-full h-full relative z-0" 
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handlePanStart}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: isPanning ? 'grabbing' : draggedNode ? 'grabbing' : 'grab' }}
            >
              {/* Prerequisite Connection Lines (with arrows) */}
              {nodes.map(node => 
                node.prerequisites.map(prereqId => {
                  const prereq = nodes.find(c => c.id === prereqId);
                  if (!prereq) return null;
                  
                  // Calculate arrow position to stop before node
                  const dx = node.x + 40 - (prereq.x + 40);
                  const dy = node.y + 40 - (prereq.y + 40);
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const unitX = dx / length;
                  const unitY = dy / length;
                  const endX = node.x + 40 - (unitX * 42); // Stop 42px before node center
                  const endY = node.y + 40 - (unitY * 42);
                  
                  return (
                    <line
                      key={`${prereqId}-${node.id}`}
                      x1={prereq.x + 40}
                      y1={prereq.y + 40}
                      x2={endX}
                      y2={endY}
                      stroke="#00FF88"
                      strokeWidth="4"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })
              )}
              
              {/* Related Concept Lines (no arrows, same level) */}
              {nodes.map(node => 
                node.connections.filter(connId => {
                  const connNode = nodes.find(c => c.id === connId);
                  return connNode && !connNode.prerequisites.includes(node.id) && !node.prerequisites.includes(connId);
                }).map(connId => {
                  const conn = nodes.find(c => c.id === connId);
                  if (!conn) return null;
                  
                  return (
                    <line
                      key={`${node.id}-${connId}-related`}
                      x1={node.x + 40}
                      y1={node.y + 40}
                      x2={conn.x + 40}
                      y2={conn.y + 40}
                      stroke="#0066FF"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                  );
                })
              )}
              
              {/* Arrow marker definitions */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    fill="#00FF88"
                    stroke="#000000"
                    strokeWidth="0.3"
                  />
                </marker>
              </defs>

              {/* Concept Nodes */}
              {nodes.map(node => {
                const colors = getNodeColor(node.id);
                const IconComponent = colors.icon;
                const masteryData = studentData[node.id];
                const isRelatedConcept = !node.prerequisites.length && !node.connections.some(conn => nodes.find(n => n.id === conn && n.prerequisites.includes(node.id)));
                const nodeSize = isRelatedConcept ? 60 : 80;
                
                return (
                  <g key={node.id}>
                    {/* Node Rectangle */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={nodeSize}
                      height={nodeSize}
                      fill={colors.bg}
                      stroke={colors.border}
                      strokeWidth={isRelatedConcept ? "2" : "4"}
                      className="cursor-move"
                      onMouseDown={(e) => handleMouseDown(e, node.id)}
                    />
                    
                    {/* Node Icon */}
                    <foreignObject
                      x={node.x + (nodeSize/2 - 14)}
                      y={node.y + (nodeSize/2 - 14)}
                      width={isRelatedConcept ? "20" : "28"}
                      height={isRelatedConcept ? "20" : "28"}
                      className="pointer-events-none"
                    >
                      <IconComponent className={`${isRelatedConcept ? 'w-5 h-5' : 'w-7 h-7'} text-pure-black`} strokeWidth={3} />
                    </foreignObject>
                    
                    {/* Node Label */}
                    <text
                      x={node.x + nodeSize/2}
                      y={node.y + nodeSize + 20}
                      textAnchor="middle"
                      className={`${isRelatedConcept ? 'text-xs' : 'text-sm'} font-black fill-pure-white font-mono`}
                    >
                      {node.name.toUpperCase()}
                    </text>
                    
                    {/* Mastery Percentage */}
                    {masteryData && !isRelatedConcept && (
                      <text
                        x={node.x + nodeSize/2}
                        y={node.y + nodeSize + 35}
                        textAnchor="middle"
                        className="text-xs font-black fill-neon-green font-mono"
                      >
                        {masteryData.masteryLevel}%
                      </text>
                    )}
                    
                    {/* Tooltip */}
                    <title>
                      {node.name}: {isRelatedConcept ? 'Related concept' : `${masteryData?.masteryLevel || 0}% mastery, ${masteryData?.confidence || 0}% confidence`} - Drag to move
                    </title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        // Normal mode with all sections
        <div className="bg-pure-white border-4 border-pure-black w-full flex flex-col neubrutalism-card">
          {/* Control Bar */}
          <div className="px-6 py-4 bg-electric-blue border-b-4 border-pure-black flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-pure-white font-mono font-bold text-sm">
                🔍 ZOOM: {Math.round(zoom * 100)}% - DRAG NODES TO REPOSITION
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {onToggleFullscreen && (
                <button
                  onClick={onToggleFullscreen}
                  className="px-4 py-2 bg-pure-white text-pure-black font-mono font-bold text-sm border-2 border-pure-black hover:bg-neon-green transition-all duration-200"
                >
                  <Maximize className="w-4 h-4 mr-2 inline" />
                  FULLSCREEN
                </button>
              )}
              
              <button
                onClick={resetView}
                className="px-4 py-2 bg-pure-white text-pure-black font-mono font-bold text-sm border-2 border-pure-black hover:bg-neon-green transition-all duration-200"
              >
                RESET VIEW
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-hot-pink text-pure-white font-mono font-bold text-sm border-2 border-pure-black hover:bg-pure-white hover:text-pure-black transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2 inline" />
                CLOSE
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-4 bg-neon-green border-b-4 border-pure-black">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-pure-black mr-2" strokeWidth={3} />
                <span className="text-sm text-pure-black font-mono font-bold">STRONG (70%+)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-pure-black mr-2" strokeWidth={3} />
                <span className="text-sm text-pure-black font-mono font-bold">DEVELOPING (50-70%)</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-pure-black mr-2" strokeWidth={3} />
                <span className="text-sm text-pure-black font-mono font-bold">NEEDS WORK (&lt;50%)</span>
              </div>
            </div>
          </div>

          {/* Graph Container */}
          <div className="flex-1 p-6 overflow-hidden bg-pure-black min-h-[600px]">
            <div className="relative w-full h-full">
              <svg 
                ref={svgRef}
                className="w-full h-full border-4 border-pure-white" 
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                preserveAspectRatio="xMidYMid meet"
                onMouseDown={handlePanStart}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: isPanning ? 'grabbing' : draggedNode ? 'grabbing' : 'grab' }}
              >
                {/* Prerequisite Connection Lines (with arrows) */}
                {nodes.map(node => 
                  node.prerequisites.map(prereqId => {
                    const prereq = nodes.find(c => c.id === prereqId);
                    if (!prereq) return null;
                    
                    // Calculate arrow position to stop before node
                    const dx = node.x + 40 - (prereq.x + 40);
                    const dy = node.y + 40 - (prereq.y + 40);
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const unitX = dx / length;
                    const unitY = dy / length;
                    const endX = node.x + 40 - (unitX * 42); // Stop 42px before node center
                    const endY = node.y + 40 - (unitY * 42);
                    
                    return (
                      <line
                        key={`${prereqId}-${node.id}`}
                        x1={prereq.x + 40}
                        y1={prereq.y + 40}
                        x2={endX}
                        y2={endY}
                        stroke="#00FF88"
                        strokeWidth="4"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })
                )}
                
                {/* Related Concept Lines (no arrows, same level) */}
                {nodes.map(node => 
                  node.connections.filter(connId => {
                    const connNode = nodes.find(c => c.id === connId);
                    return connNode && !connNode.prerequisites.includes(node.id) && !node.prerequisites.includes(connId);
                  }).map(connId => {
                    const conn = nodes.find(c => c.id === connId);
                    if (!conn) return null;
                    
                    return (
                      <line
                        key={`${node.id}-${connId}-related`}
                        x1={node.x + 40}
                        y1={node.y + 40}
                        x2={conn.x + 40}
                        y2={conn.y + 40}
                        stroke="#0066FF"
                        strokeWidth="2"
                        strokeDasharray="8,4"
                      />
                    );
                  })
                )}
                
                {/* Arrow marker definitions */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <polygon
                      points="0 0, 8 3, 0 6"
                      fill="#00FF88"
                      stroke="#000000"
                      strokeWidth="0.3"
                    />
                  </marker>
                </defs>

                {/* Concept Nodes */}
                {nodes.map(node => {
                  const colors = getNodeColor(node.id);
                  const IconComponent = colors.icon;
                  const masteryData = studentData[node.id];
                  const isRelatedConcept = !node.prerequisites.length && !node.connections.some(conn => nodes.find(n => n.id === conn && n.prerequisites.includes(node.id)));
                  const nodeSize = isRelatedConcept ? 60 : 80;
                  
                  return (
                    <g key={node.id}>
                      {/* Node Rectangle */}
                      <rect
                        x={node.x}
                        y={node.y}
                        width={nodeSize}
                        height={nodeSize}
                        fill={colors.bg}
                        stroke={colors.border}
                        strokeWidth={isRelatedConcept ? "2" : "4"}
                        className="cursor-move"
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                      />
                      
                      {/* Node Icon */}
                      <foreignObject
                        x={node.x + (nodeSize/2 - 14)}
                        y={node.y + (nodeSize/2 - 14)}
                        width={isRelatedConcept ? "20" : "28"}
                        height={isRelatedConcept ? "20" : "28"}
                        className="pointer-events-none"
                      >
                        <IconComponent className={`${isRelatedConcept ? 'w-5 h-5' : 'w-7 h-7'} text-pure-black`} strokeWidth={3} />
                      </foreignObject>
                      
                      {/* Node Label */}
                      <text
                        x={node.x + nodeSize/2}
                        y={node.y + nodeSize + 20}
                        textAnchor="middle"
                        className={`${isRelatedConcept ? 'text-xs' : 'text-sm'} font-black fill-pure-white font-mono`}
                      >
                        {node.name.toUpperCase()}
                      </text>
                      
                      {/* Mastery Percentage */}
                      {masteryData && !isRelatedConcept && (
                        <text
                          x={node.x + nodeSize/2}
                          y={node.y + nodeSize + 35}
                          textAnchor="middle"
                          className="text-xs font-black fill-neon-green font-mono"
                        >
                          {masteryData.masteryLevel}%
                        </text>
                      )}
                      
                      {/* Tooltip */}
                      <title>
                        {node.name}: {isRelatedConcept ? 'Related concept' : `${masteryData?.masteryLevel || 0}% mastery, ${masteryData?.confidence || 0}% confidence`} - Drag to move
                      </title>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="p-6 bg-electric-blue border-t-4 border-pure-black">
            <h3 className="text-lg font-black text-pure-white mb-4 font-mono tracking-wide">DETAILED CONCEPT ANALYSIS</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(studentData).slice(0, 6).map(([conceptId, data]) => {
                const colors = getNodeColor(conceptId);
                const conceptName = conceptId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <div key={conceptId} className="bg-pure-white border-2 border-pure-black p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 mr-2 border border-pure-black" style={{ backgroundColor: colors.bg }}></div>
                      <h4 className="font-mono font-bold text-sm text-pure-black">{conceptName}</h4>
                    </div>
                    <div className="space-y-1 text-xs text-pure-black font-mono font-bold">
                      <div>MASTERY: {data.masteryLevel}%</div>
                      <div>CONFIDENCE: {data.confidence}%</div>
                      <div>ATTEMPTS: {data.attempts}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-pure-white font-mono font-bold text-sm">
                🔗 GREEN ARROWS = PREREQUISITES • 🔗 BLUE DASHED = RELATED CONCEPTS • SCROLL TO ZOOM FROM CENTER • DRAG BACKGROUND TO PAN • DRAG NODES TO REPOSITION
              </p>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default KnowledgeGraph;