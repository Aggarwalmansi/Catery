'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
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
// We will use a dynamic renderScale for the visual canvas
const BASE_SCALE = 10;
const TARGET_CANVAS_SIZE = 800; // Large, comfortable working area regardless of venue size

const EventPlanner = () => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);

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

    // Object tracking
    const [selectedObject, setSelectedObject] = useState(null);
    const [objectCount, setObjectCount] = useState({ tables: 0, buffets: 0 });

    // UI state
    const [showHowItWorks, setShowHowItWorks] = useState(false);

    // Narrative insights state
    const [narrativeInsights, setNarrativeInsights] = useState(null);
    const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);

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
        setVenueLengthFt(venue.lengthFt);
        setVenueWidthFt(venue.widthFt);
        setGuestCount(venue.capacity);
    };

    /**
     * Initialize canvas
     */
    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: '#f8f9fa',
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
        // Grid should be consistent with venue feet (e.g., every 5 feet)
        const gridSize = 5 * renderScale;
        for (let i = 0; i < canvasWidth / gridSize; i++) {
            canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, canvasHeight], {
                stroke: '#e0e0e0',
                selectable: false,
                evented: false,
                id: 'grid'
            }));
        }
        for (let i = 0; i < canvasHeight / gridSize; i++) {
            canvas.add(new fabric.Line([0, i * gridSize, canvasWidth, i * gridSize], {
                stroke: '#e0e0e0',
                selectable: false,
                evented: false,
                id: 'grid'
            }));
        }
    };

    const addDefaultElements = (canvas) => {
        // Entry point
        const entryCircle = new fabric.Circle({
            radius: 20,
            fill: '#4CAF50',
            stroke: '#2E7D32',
            strokeWidth: 3,
            originX: 'center',
            originY: 'center'
        });

        const entryLabel = new fabric.Text('Entry', {
            fontSize: 12,
            fill: '#FFFFFF',
            fontWeight: 'bold',
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

        // Exit point
        const exitCircle = new fabric.Circle({
            radius: 20,
            fill: '#f44336',
            stroke: '#c62828',
            strokeWidth: 3,
            originX: 'center',
            originY: 'center'
        });

        const exitLabel = new fabric.Text('Exit', {
            fontSize: 12,
            fill: '#FFFFFF',
            fontWeight: 'bold',
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

        // Sample tables
        addTable(canvas, Math.min(150, canvasWidth / 3), Math.min(100, canvasHeight / 4), 'round', 8);
        addTable(canvas, Math.min(300, canvasWidth / 2), Math.min(100, canvasHeight / 4), 'round', 8);
        addTable(canvas, Math.min(150, canvasWidth / 3), Math.min(250, canvasHeight * 0.6), 'rectangular', 6);

        // Buffet station (20ft)
        addBuffet(canvas, canvasWidth / 2 - 100, canvasHeight - 80, 20);

        canvas.add(entryGroup, exitGroup);
    };

    const addTable = (canvas, x, y, type, seats) => {
        let tableShape;
        const baseColor = '#FFF3E0';
        const strokeColor = '#FF9800';

        if (type === 'round') {
            tableShape = new fabric.Circle({
                radius: 40,
                fill: baseColor,
                stroke: strokeColor,
                strokeWidth: 2,
                originX: 'center',
                originY: 'center'
            });
        } else {
            tableShape = new fabric.Rect({
                width: 120,
                height: 60,
                fill: baseColor,
                stroke: strokeColor,
                strokeWidth: 2,
                rx: 5,
                ry: 5,
                originX: 'center',
                originY: 'center'
            });
        }

        const seatLabel = new fabric.Text(`${seats} seats`, {
            fontSize: 11,
            fill: '#E65100',
            fontWeight: 'bold',
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
        updateObjectCount(canvas);
    };

    const addBuffet = (canvas, x, y, lengthFt) => {
        const widthPx = lengthFt * renderScale; // Use specific render scale

        const buffetRect = new fabric.Rect({
            width: widthPx,
            height: 40,
            fill: '#fff7ed',
            stroke: '#fdba74',
            strokeWidth: 2,
            rx: 5,
            ry: 5,
            originX: 'center',
            originY: 'center'
        });

        const buffetLabel = new fabric.Text(`Buffet ${lengthFt}ft`, {
            fontSize: 12,
            fill: '#9a3412',
            fontWeight: '600',
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


    /**
     * Export Professional Report from backend
     */
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
                radius: 3 * renderScale, // Relative radius
                fill: `rgba(255, 0, 0, ${zone.severity * 0.4})`,
                stroke: '#ff0000',
                strokeWidth: 2,
                selectable: false,
                evented: false,
                id: 'heatmap',
                originX: 'center',
                originY: 'center'
            });
            canvas.add(heatCircle);
        });
        canvas.renderAll();
    };

    const clearHeatmap = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects();
        objects.forEach(obj => {
            if (obj.id === 'heatmap') canvas.remove(obj);
        });
        canvas.renderAll();
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
        if (confirm('Clear all tables and buffets? Entry/exit points will remain.')) {
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
        }
    };

    const exportPDF = async () => {
        const { jsPDF } = await import('jspdf');
        const html2canvas = (await import('html2canvas')).default;

        const canvas = canvasRef.current;
        const canvasImage = await html2canvas(canvas);
        const pdf = new jsPDF('landscape');

        pdf.setFontSize(20);
        pdf.text('Event Layout Analysis - OccasionOS', 15, 20);

        const imgData = canvasImage.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 15, 30, 180, 120);

        if (results) {
            pdf.setFontSize(14);
            pdf.text('Recommendations', 15, 160);
            pdf.setFontSize(11);
            pdf.text(`Venue: ${venueSqFt} sq ft | Guests: ${guestCount} | Duration: ${duration} hours`, 15, 170);
            pdf.text(`Staff: ${results.recommendations.staff.count} servers`, 15, 180);
            pdf.text(`Buffet: ${results.recommendations.buffet.recommendedLength}ft`, 15, 190);
            pdf.text(`Plates: ${results.recommendations.plates.total}`, 15, 200);
        }

        pdf.save('event-layout-analysis.pdf');
    };

    return (
        <div className="planner-container">
            <div className="planner-header">
                <h1>Event Flow Planner</h1>
                <p>Design your layout and get professional recommendations</p>
            </div>

            <div className="planner-workspace">
                {/* Control Panel */}
                <div className="control-panel">
                    <h3>Event Configuration</h3>

                    <div className="control-group">
                        <label>Venue Type</label>
                        <select value={venuePreset} onChange={(e) => handleVenuePresetChange(e.target.value)}>
                            {Object.entries(VENUE_PRESETS).map(([key, venue]) => (
                                <option key={key} value={key}>{venue.name}</option>
                            ))}
                        </select>
                        <small className="help-text">{venueSqFt.toLocaleString()} sq ft ({venueLengthFt}ft × {venueWidthFt}ft)</small>
                    </div>

                    {venuePreset === 'custom' && (
                        <>
                            <div className="control-group">
                                <label>Length (feet)</label>
                                <input
                                    type="number"
                                    value={venueLengthFt}
                                    onChange={(e) => setVenueLengthFt(Math.max(20, Math.min(120, parseInt(e.target.value) || 50)))}
                                    min="20"
                                    max="120"
                                />
                            </div>
                            <div className="control-group">
                                <label>Width (feet)</label>
                                <input
                                    type="number"
                                    value={venueWidthFt}
                                    onChange={(e) => setVenueWidthFt(Math.max(20, Math.min(100, parseInt(e.target.value) || 40)))}
                                    min="20"
                                    max="100"
                                />
                            </div>
                        </>
                    )}

                    <div className="control-group">
                        <label>Guest Count</label>
                        <input
                            type="number"
                            value={guestCount}
                            onChange={(e) => setGuestCount(Math.max(10, Math.min(500, parseInt(e.target.value) || 100)))}
                            min="10"
                            max="500"
                        />
                        <small className="help-text">10 - 500 guests</small>
                    </div>

                    <div className="control-group">
                        <label>Event Duration</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Math.max(1, Math.min(8, parseInt(e.target.value) || 3)))}
                            min="1"
                            max="8"
                        />
                        <small className="help-text">1 - 8 hours</small>
                    </div>

                    <div className="object-count">
                        <div>Tables: {objectCount.tables}</div>
                        <div>Buffets: {objectCount.buffets}</div>
                    </div>

                    <div className="control-actions">
                        <button className="btn-add" onClick={() => addTable(fabricCanvasRef.current, 200, 150, 'round', 8)}>
                            + Round Table (8 seats)
                        </button>
                        <button className="btn-add" onClick={() => addTable(fabricCanvasRef.current, 200, 150, 'rectangular', 6)}>
                            + Rectangular Table (6 seats)
                        </button>
                        <button className="btn-add" onClick={() => addBuffet(fabricCanvasRef.current, 200, 150, 20)}>
                            + Buffet Station (20ft)
                        </button>
                    </div>

                    {selectedObject && selectedObject.id !== 'entry' && selectedObject.id !== 'exit' && (
                        <button className="btn-delete" onClick={deleteSelectedObject}>
                            Delete Selected
                        </button>
                    )}

                    <button className="btn-clear-canvas" onClick={clearLayout}>
                        Clear Layout
                    </button>

                    <button className="btn-simulate" onClick={analyzeEventFlow} disabled={isAnalyzing}>
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Event Flow'}
                    </button>

                    {showHeatmap && (
                        <button className="btn-clear" onClick={clearHeatmap}>
                            Clear Heatmap
                        </button>
                    )}
                </div>

                {/* Canvas */}
                <div className="canvas-area">
                    <canvas ref={canvasRef} />
                    <div className="canvas-help">
                        <p>Drag to reposition | Select & Delete/Backspace to remove</p>
                    </div>
                </div>

                {/* Results */}
                {results && (
                    <div className="results-panel">
                        <h3>Analysis Results</h3>

                        <div className="recommendation-card">
                            <div className="rec-header">
                                <span className="rec-icon">👥</span>
                                <h4>Staff Needed</h4>
                            </div>
                            <div className="rec-value">{results.recommendations.staff.count} servers</div>
                            <p className="rec-reason">{results.recommendations.staff.reason}</p>
                            <span className="confidence-badge">{results.recommendations.staff.confidence}</span>
                        </div>

                        <div className="recommendation-card">
                            <div className="rec-header">
                                <span className="rec-icon">🍽️</span>
                                <h4>Buffet Length</h4>
                            </div>
                            <div className="rec-value">{results.recommendations.buffet.recommendedLength} feet</div>
                            <p className="rec-reason">{results.recommendations.buffet.reason}</p>
                            <span className="confidence-badge">{results.recommendations.buffet.confidence}</span>
                        </div>

                        <div className="recommendation-card">
                            <div className="rec-header">
                                <h4>Plates Needed</h4>
                            </div>
                            <div className="rec-value">{results.recommendations.plates.total} plates</div>
                            <p className="rec-reason">{results.recommendations.plates.reason}</p>
                            <span className="confidence-badge">{results.recommendations.plates.confidence}</span>
                        </div>

                        <div className="metrics-summary">
                            <h4>Flow Metrics</h4>
                            <div className="metrics-grid">
                                <div className="metric">
                                    <span className="metric-label">Avg Wait</span>
                                    <span className="metric-value">{results.metrics.avgWaitTime} min</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Peak Load</span>
                                    <span className="metric-value">{results.metrics.peakDiners} guests</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Congestion</span>
                                    <span className="metric-value">{results.metrics.congestionZones} zones</span>
                                </div>
                            </div>
                        </div>

                        {/* Narrative Insights Section */}
                        <div className="ai-insights-panel">
                            <div className="ai-header">
                                <h4>Narrative Insights</h4>
                            </div>
                            <div className="ai-content">
                                <p>Based on the simulation, your layout appears well-optimized for the guest count. Check the metrics below for specific details on staffing and resources.</p>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-export-professional" onClick={exportProfessionalReport}>
                                Professional Report
                            </button>
                            <button className="btn-export" onClick={exportPDF}>
                                Export Schematic
                            </button>
                        </div>

                        <button className="btn-how-it-works" onClick={() => setShowHowItWorks(!showHowItWorks)}>
                            How This Works
                        </button>
                    </div>
                )}
            </div>

            {/* How It Works Modal */}
            {showHowItWorks && (
                <div className="modal-overlay" onClick={() => setShowHowItWorks(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>How Event Flow Analysis Works</h2>

                        <h3>What We Analyze</h3>
                        <p><strong>Guest Movement:</strong> We simulate how guests move through your venue from entry → tables → buffet → exit to identify potential bottlenecks.</p>

                        <p><strong>Service Capacity:</strong> Based on your buffet length and layout, we calculate how many guests can be served simultaneously.</p>

                        <p><strong>Peak Load:</strong> We identify when the most guests will be at the buffet at once, typically 40-60% of total attendance.</p>

                        <h3>Our Recommendations</h3>
                        <p><strong>Staff Count:</strong> Based on industry standard ratios (1 server per 40-50 guests for buffet service) adjusted for your specific layout efficiency.</p>

                        <p><strong>Buffet Length:</strong> Follows catering industry guidelines: minimum 1ft per 10 guests, comfortable at 1.5ft per 10 guests.</p>

                        <p><strong>Plate Count:</strong> Total guest count plus 15-20% buffer for replacements and multiple trips.</p>

                        <h3>Confidence Levels</h3>
                        <p><strong>High:</strong> Based on established industry standards</p>
                        <p><strong>Medium:</strong> Adjusted for your specific layout</p>

                        <p className="disclaimer"><em>These are planning recommendations based on typical event patterns. Actual needs may vary based on menu complexity, guest demographics, and service style.</em></p>

                        <button className="btn-close" onClick={() => setShowHowItWorks(false)}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EventPlanner;
