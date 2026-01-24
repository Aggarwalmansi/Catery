'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import {
    Maximize,
    Users,
    Clock,
    Layout,
    Play,
    Trash2,
    RotateCw,
    Plus,
    Utensils,
    Download,
    FileText,
    HelpCircle,
    X,
    ChevronRight,
    Armchair,
    Square
} from 'lucide-react';
import './planner.css';

/**
 * Venue presets with real-world dimensions
 */
const VENUE_PRESETS = {
    banquetHall: {
        name: "Banquet Hall",
        sqft: 2500,
        lengthFt: 50,
        widthFt: 50,
        capacity: 150,
        description: "Indoor hall with buffet area"
    },
    outdoorLawn: {
        name: "Outdoor Lawn",
        sqft: 4000,
        lengthFt: 80,
        widthFt: 50,
        capacity: 200,
        description: "Open-air venue"
    },
    conferenceRoom: {
        name: "Conference Room",
        sqft: 1200,
        lengthFt: 40,
        widthFt: 30,
        capacity: 80,
        description: "Corporate event space"
    },
    custom: {
        name: "Custom Venue",
        sqft: 0,
        lengthFt: 50,
        widthFt: 40,
        capacity: 100,
        description: "Custom dimensions"
    }
};

// Initial Base Scale: 1 foot = 10 pixels for internal logic
const TARGET_CANVAS_SIZE = 800;

const EventPlanner = () => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const containerRef = useRef(null);

    // Venue configuration
    const [venuePreset, setVenuePreset] = useState('banquetHall');
    const [venueLengthFt, setVenueLengthFt] = useState(50);
    const [venueWidthFt, setVenueWidthFt] = useState(50);

    // Event configuration
    const [guestCount, setGuestCount] = useState(150);
    const [duration, setDuration] = useState(3);

    // Simulation state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Object tracking
    const [selectedObject, setSelectedObject] = useState(null);
    const [objectCount, setObjectCount] = useState({ tables: 0, buffets: 0 });

    // UI state
    const [showHowItWorks, setShowHowItWorks] = useState(false);

    // Calculate dynamic scale factor to fill target size
    // This ensures a 50x50 venue looks as large as an 80x80 venue on screen
    const maxDimension = Math.max(venueLengthFt, venueWidthFt);
    const renderScale = TARGET_CANVAS_SIZE / maxDimension;

    // Physical pixels for the canvas element
    const canvasWidth = venueLengthFt * renderScale;
    const canvasHeight = venueWidthFt * renderScale;
    const venueSqFt = venueLengthFt * venueWidthFt;

    /**
     * Handle venue preset change
     */
    const handleVenuePresetChange = (preset) => {
        setVenuePreset(preset);
        const venue = VENUE_PRESETS[preset];
        if (preset !== 'custom') {
            setVenueLengthFt(venue.lengthFt);
            setVenueWidthFt(venue.widthFt);
            setGuestCount(venue.capacity);
        }
    };

    /**
     * Initialize canvas
     */
    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: '#ffffff',
            selection: true
        });

        fabricCanvasRef.current = canvas;

        // Selection handlers
        canvas.on('selection:created', (e) => setSelectedObject(e.selected[0]));
        canvas.on('selection:updated', (e) => setSelectedObject(e.selected[0]));
        canvas.on('selection:cleared', () => setSelectedObject(null));

        addGrid(canvas);
        addDefaultElements(canvas);
        updateObjectCount(canvas);

        return () => {
            canvas.dispose();
        };
    }, [canvasWidth, canvasHeight]);

    /**
     * Keyboard deletion
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject) {
                if (selectedObject.id !== 'entry' && selectedObject.id !== 'exit') {
                    fabricCanvasRef.current.remove(selectedObject);
                    setSelectedObject(null);
                    updateObjectCount(fabricCanvasRef.current);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedObject]);

    const addGrid = (canvas) => {
        const gridSize = 5 * renderScale;
        const gridColor = 'rgba(0,0,0,0.05)';

        for (let i = 0; i < canvasWidth / gridSize; i++) {
            canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, canvasHeight], {
                stroke: gridColor,
                selectable: false,
                evented: false,
                id: 'grid'
            }));
        }
        for (let i = 0; i < canvasHeight / gridSize; i++) {
            canvas.add(new fabric.Line([0, i * gridSize, canvasWidth, i * gridSize], {
                stroke: gridColor,
                selectable: false,
                evented: false,
                id: 'grid'
            }));
        }
    };

    const addDefaultElements = (canvas) => {
        // Styled Entry Point
        const entryCircle = new fabric.Circle({
            radius: 18,
            fill: '#10b981',
            stroke: '#059669',
            strokeWidth: 2,
            shadow: new fabric.Shadow({ color: 'rgba(16,185,129,0.3)', blur: 10 }),
            originX: 'center',
            originY: 'center'
        });

        const entryLabel = new fabric.Text('IN', {
            fontSize: 11,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            fontFamily: 'Inter',
            originX: 'center',
            originY: 'center'
        });

        const entryGroup = new fabric.Group([entryCircle, entryLabel], {
            left: 50,
            top: canvasHeight / 2,
            selectable: true,
            hasControls: false,
            originX: 'center',
            originY: 'center'
        });
        (entryGroup as any).id = 'entry';

        // Styled Exit Point
        const exitCircle = new fabric.Circle({
            radius: 18,
            fill: '#ef4444',
            stroke: '#b91c1c',
            strokeWidth: 2,
            shadow: new fabric.Shadow({ color: 'rgba(239,68,68,0.3)', blur: 10 }),
            originX: 'center',
            originY: 'center'
        });

        const exitLabel = new fabric.Text('OUT', {
            fontSize: 11,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            fontFamily: 'Inter',
            originX: 'center',
            originY: 'center'
        });

        const exitGroup = new fabric.Group([exitCircle, exitLabel], {
            left: canvasWidth - 50,
            top: canvasHeight / 2,
            selectable: true,
            hasControls: false,
            originX: 'center',
            originY: 'center'
        });
        (exitGroup as any).id = 'exit';

        canvas.add(entryGroup, exitGroup);
    };

    const addTable = (canvas, x, y, type, seats) => {
        let tableShape;
        const baseColor = '#ffffff';
        const strokeColor = '#d4af37'; // Champagne Gold

        if (type === 'round') {
            tableShape = new fabric.Circle({
                radius: 35,
                fill: baseColor,
                stroke: strokeColor,
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.05)', blur: 5, offsetY: 2 })
            });
        } else {
            tableShape = new fabric.Rect({
                width: 100,
                height: 50,
                fill: baseColor,
                stroke: strokeColor,
                strokeWidth: 2,
                rx: 4,
                ry: 4,
                originX: 'center',
                originY: 'center',
                shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.05)', blur: 5, offsetY: 2 })
            });
        }

        const seatLabel = new fabric.Text(`${seats}`, {
            fontSize: 12,
            fill: '#b59020',
            fontWeight: '600',
            fontFamily: 'Inter',
            originX: 'center',
            originY: 'center'
        });

        const tableGroup = new fabric.Group([tableShape, seatLabel], {
            left: x,
            top: y,
            originX: 'center',
            originY: 'center'
        });

        (tableGroup as any).objectType = 'table';
        (tableGroup as any).id = `table-${Date.now()}`;
        (tableGroup as any).capacity = seats;

        canvas.add(tableGroup);
        canvas.setActiveObject(tableGroup);
        updateObjectCount(canvas);
    };

    const addBuffet = (canvas, x, y, lengthFt) => {
        const widthPx = lengthFt * renderScale;

        const buffetRect = new fabric.Rect({
            width: widthPx,
            height: 35,
            fill: '#fffbf7', // Warm ivory
            stroke: '#d4af37',
            strokeWidth: 2,
            rx: 4,
            ry: 4,
            originX: 'center',
            originY: 'center',
            shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.05)', blur: 5, offsetY: 2 })
        });

        const buffetLabel = new fabric.Text('BUFFET', {
            fontSize: 10,
            fill: '#b59020',
            fontWeight: '600',
            fontFamily: 'Inter',
            originX: 'center',
            originY: 'center'
        });

        const buffetGroup = new fabric.Group([buffetRect, buffetLabel], {
            left: x,
            top: y,
            originX: 'center',
            originY: 'center'
        });

        (buffetGroup as any).objectType = 'buffet';
        (buffetGroup as any).id = `buffet-${Date.now()}`;
        (buffetGroup as any).lengthFt = lengthFt;

        canvas.add(buffetGroup);
        canvas.setActiveObject(buffetGroup);
        updateObjectCount(canvas);
    };

    const updateObjectCount = (canvas) => {
        const objects = canvas.getObjects();
        const tables = objects.filter(obj => obj.objectType === 'table' || obj.id?.startsWith('table')).length;
        const buffets = objects.filter(obj => obj.objectType === 'buffet' || obj.id?.startsWith('buffet')).length;
        setObjectCount({ tables, buffets });
    };

    const extractLayout = () => {
        const canvas = fabricCanvasRef.current;
        const objects = canvas.getObjects();

        const layout = {
            venueLengthFt,
            venueWidthFt,
            venueSqFt,
            tables: [],
            buffets: [],
            entry: null,
            exit: null
        };

        objects.forEach(obj => {
            if (obj.id === 'entry') {
                layout.entry = { x: obj.left / renderScale, y: obj.top / renderScale };
            } else if (obj.id === 'exit') {
                layout.exit = { x: obj.left / renderScale, y: obj.top / renderScale };
            } else if (obj.objectType === 'table' || obj.id?.startsWith('table')) {
                layout.tables.push({
                    id: obj.id,
                    x: obj.left / renderScale,
                    y: obj.top / renderScale,
                    capacity: obj.capacity || 8
                });
            } else if (obj.objectType === 'buffet' || obj.id?.startsWith('buffet')) {
                layout.buffets.push({
                    id: obj.id,
                    x: obj.left / renderScale,
                    y: obj.top / renderScale,
                    lengthFt: obj.lengthFt || 20
                });
            }
        });

        return layout;
    };

    const analyzeEventFlow = async () => {
        setIsAnalyzing(true);
        setResults(null);
        setShowHeatmap(false);
        clearHeatmap();
        setShowResults(true); // Open panel immediately to show loading if we had it

        try {
            const layout = extractLayout();

            if (!layout.tables || layout.tables.length === 0) {
                alert('Please add at least one table to your layout');
                setIsAnalyzing(false);
                return;
            }

            if (!layout.buffets || layout.buffets.length === 0) {
                alert('Please add at least one buffet station to your layout');
                setIsAnalyzing(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/planner/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    layout,
                    guestCount,
                    duration
                })
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                setIsAnalyzing(false);
                return;
            }

            setResults(data);
            setShowHeatmap(true);

            if (data.congestionZones && data.congestionZones.length > 0) {
                drawCongestionZones(data.congestionZones);
            }

        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to analyze event flow. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const exportProfessionalReport = async () => {
        try {
            const layout = extractLayout();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metrics: results.metrics,
                    recommendations: results.recommendations,
                    layout,
                    guestCount,
                    eventDetails: { name: venuePreset === 'custom' ? 'Custom Event' : VENUE_PRESETS[venuePreset].name }
                })
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Professional_Event_Analysis.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Report export error:', error);
            alert('Failed to generate professional report.');
        }
    };

    const drawCongestionZones = (zones) => {
        const canvas = fabricCanvasRef.current;
        zones.forEach(zone => {
            const heatCircle = new fabric.Circle({
                left: zone.x * renderScale,
                top: zone.y * renderScale,
                radius: 5 * renderScale, // Larger radius for visibility
                fill: `rgba(239, 68, 68, ${Math.min(zone.severity * 0.3, 0.6)})`, // Red with opacity
                stroke: 'transparent',
                selectable: false,
                evented: false,
                id: 'heatmap',
                originX: 'center',
                originY: 'center'
            });
            canvas.add(heatCircle);
        });
        const gridObj = canvas.getObjects().find(o => o.id === 'grid');
        if (gridObj) {
            canvas.moveObjectTo(gridObj, 0);
        }
    };

    const clearHeatmap = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects();
        objects.forEach(obj => {
            if (obj.id === 'heatmap') canvas.remove(obj);
        });
        setShowHeatmap(false);
    };

    const deleteSelectedObject = () => {
        if (selectedObject && selectedObject.id !== 'entry' && selectedObject.id !== 'exit') {
            fabricCanvasRef.current.remove(selectedObject);
            setSelectedObject(null);
            updateObjectCount(fabricCanvasRef.current);
        }
    };

    const clearLayout = () => {
        if (confirm('Clear all tables and buffets?')) {
            const canvas = fabricCanvasRef.current;
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.objectType === 'table' || obj.objectType === 'buffet' ||
                    obj.id?.startsWith('table') || obj.id?.startsWith('buffet')) {
                    canvas.remove(obj);
                }
            });
            updateObjectCount(canvas);
            clearHeatmap();
            setResults(null);
            setShowResults(false);
        }
    };

    return (
        <div className="planner-container">
            {/* Header */}
            <header className="planner-header">
                <h1>Event Flow Planner <span className="beta-tag" style={{ fontSize: '0.7em', color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: '4px' }}>BETA</span></h1>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => setShowHowItWorks(true)}>
                        <HelpCircle size={18} /> Help
                    </button>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => confirm('Exit planner?') ? window.history.back() : null}>
                        Done
                    </button>
                </div>
            </header>

            <div className="planner-workspace">
                {/* Left Sidebar - Configuration */}
                <aside className="config-sidebar">

                    <div className="config-section">
                        <h3>Venue Details</h3>
                        <div className="input-group">
                            <div className="input-card">
                                <label><Layout size={14} style={{ display: 'inline', marginRight: 4 }} /> Venue Type</label>
                                <select value={venuePreset} onChange={(e) => handleVenuePresetChange(e.target.value)}>
                                    {Object.entries(VENUE_PRESETS).map(([key, venue]) => (
                                        <option key={key} value={key}>{venue.name} ({venue.sqft.toLocaleString()} sq ft)</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {venuePreset === 'custom' && (
                            <div className="input-row">
                                <div className="input-card">
                                    <label>Length (ft)</label>
                                    <input type="number" value={venueLengthFt} onChange={(e) => setVenueLengthFt(Number(e.target.value))} />
                                </div>
                                <div className="input-card">
                                    <label>Width (ft)</label>
                                    <input type="number" value={venueWidthFt} onChange={(e) => setVenueWidthFt(Number(e.target.value))} />
                                </div>
                            </div>
                        )}

                        <div style={{ fontSize: '0.8rem', color: '#6b6b6b', marginTop: '0.5rem' }}>
                            <Maximize size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                            <span style={{ verticalAlign: 'middle', marginLeft: '4px' }}>
                                {venueSqFt.toLocaleString()} sq ft total area
                            </span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Event Parameters</h3>
                        <div className="input-group">
                            <div className="input-card">
                                <label><Users size={14} style={{ display: 'inline', marginRight: 4 }} /> Guest Count</label>
                                <input
                                    type="number"
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(Math.max(10, Math.min(1000, Number(e.target.value))))}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-card">
                                <label><Clock size={14} style={{ display: 'inline', marginRight: 4 }} /> Duration (Hrs)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Layout Objects</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#2c2c2c' }}>
                            <span>Tables: <strong>{objectCount.tables}</strong></span>
                            <span>Buffets: <strong>{objectCount.buffets}</strong></span>
                        </div>
                    </div>

                    <div className="primary-actions">
                        <button
                            className="btn-primary"
                            onClick={analyzeEventFlow}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? <RotateCw className="spin" size={18} /> : <Play size={18} fill="currentColor" />}
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Flow'}
                        </button>

                        <button className="btn-secondary" onClick={clearLayout}>
                            <RotateCw size={18} /> Clear Layout
                        </button>
                    </div>
                </aside>

                {/* Right Area - Canvas & Tools */}
                <main className="planner-canvas-area" ref={containerRef}>

                    {/* Floating Toolbar */}
                    <div className="floating-toolbar">
                        <button className="tool-btn" onClick={() => addTable(fabricCanvasRef.current, canvasWidth / 2, canvasHeight / 2, 'round', 8)}>
                            <Armchair size={18} /> Round (8)
                        </button>
                        <button className="tool-btn" onClick={() => addTable(fabricCanvasRef.current, canvasWidth / 2, canvasHeight / 2, 'rect', 6)}>
                            <Square size={18} /> Rect (6)
                        </button>
                        <button className="tool-btn" onClick={() => addBuffet(fabricCanvasRef.current, canvasWidth / 2, canvasHeight / 2 + 100, 20)}>
                            <Utensils size={18} /> Buffet (20ft)
                        </button>
                        {selectedObject && (
                            <button className="tool-btn tool-delete" onClick={deleteSelectedObject} style={{ color: '#ef4444' }}>
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {/* Canvas Container */}
                    <div className="canvas-container">
                        <canvas ref={canvasRef} />
                    </div>

                    {/* Results Overlay Panel */}
                    {showResults && results && (
                        <div className="results-overlay">
                            <div className="results-header">
                                <h3>Analysis Results</h3>
                                <button className="close-btn" onClick={() => setShowResults(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="results-content">
                                <div className="metric-row">
                                    <span className="metric-label">Staff Required</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="metric-value">{results.recommendations.staff.count} Servers</div>
                                        <div className="status-badge status-good">{results.recommendations.staff.confidence} conf.</div>
                                    </div>
                                </div>
                                <div className="metric-row">
                                    <span className="metric-label">Buffet Size</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="metric-value">{results.recommendations.buffet.recommendedLength} ft</div>
                                        <div className="status-badge status-good">Optimal</div>
                                    </div>
                                </div>
                                <div className="metric-row">
                                    <span className="metric-label">Est. Wait Time</span>
                                    <div className="metric-value">{results.metrics.avgWaitTime} min</div>
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <button className="btn-primary" style={{ width: '100%' }} onClick={exportProfessionalReport}>
                                        <Download size={16} /> Export PDF Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* How It Works Modal */}
            {showHowItWorks && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowHowItWorks(false)}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '12px',
                        maxWidth: '500px', width: '90%'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '1rem', color: '#2c2c2c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HelpCircle size={24} color="#d4af37" /> Event Flow Logic
                        </h2>
                        <p style={{ color: '#6b6b6b', lineHeight: 1.6 }}>
                            OccasionOS uses a deterministic simulation to predict guest flow. We analyze:
                        </p>
                        <ul style={{ margin: '1rem 0', paddingLeft: '1.2rem', color: '#4b4b4b', lineHeight: 1.8 }}>
                            <li><strong>Pathfinding:</strong> Distance from entry → tables → buffet.</li>
                            <li><strong>Service Rate:</strong> 10ft of buffet serves ~40 guests/hour efficiently.</li>
                            <li><strong>Congestion:</strong> Areas with &lt; 3ft clearance turn red.</li>
                        </ul>
                        <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowHowItWorks(false)}>
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventPlanner;
