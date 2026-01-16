/**
 * Event Flow Planner - Business-Realistic Controller
 * 
 * Provides professional event planning recommendations using industry-standard
 * ratios and realistic flow simulation.
 * 
 * Key principles:
 * - Real-world metrics (2-10 min wait times)
 * - Industry-standard staff ratios (1:40-50 for buffet service)
 * - Path-based congestion tracking
 * - Business-appropriate confidence levels
 */

/**
 * Simplified agent for path tracking
 */
class Agent {
    constructor(id, entry) {
        this.id = id;
        this.x = entry.x;
        this.y = entry.y;
        this.state = 'entering';
        this.path = [{ x: this.x, y: this.y }]; // Track movement path
    }

    moveTo(targetX, targetY, speed = 0.5) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < speed) {
            this.x = targetX;
            this.y = targetY;
            this.path.push({ x: this.x, y: this.y });
            return true;
        }

        this.x += (dx / distance) * speed;
        this.y += (dy / distance) * speed;
        this.path.push({ x: this.x, y: this.y });
        return false;
    }
}

/**
 * Simulate event flow and generate business-realistic recommendations
 */
const simulateEvent = (layout, guestCount, duration) => {
    const { tables, buffets, entry, exit, venueSqFt } = layout;

    // Validate layout
    if (!tables || tables.length === 0) {
        return { error: 'Layout must include at least one table' };
    }
    if (!buffets || buffets.length === 0) {
        return { error: 'Layout must include at least one buffet station' };
    }

    // Calculate realistic metrics based on industry standards

    // 1. Peak Concurrent Diners (40-60% of total guests at peak moment)
    let peakDinersPercent = 0.5; // 50% baseline
    if (duration >= 4) {
        peakDinersPercent = 0.4; // Longer events = more staggered dining
    }
    const peakConcurrentDiners = Math.floor(guestCount * peakDinersPercent);

    // 2. Buffet Service Capacity
    const totalBuffetLengthFt = buffets.reduce((sum, b) => sum + (b.lengthFt || 20), 0);
    const buffetCapacity = Math.floor(totalBuffetLengthFt / 2); // 1 guest per 2ft

    // 3. Service Rate (guests served per minute)
    const serviceRate = buffetCapacity * 0.5; // Each station serves ~0.5 guests/min

    // 4. Arrival Rate at Peak (guests arriving at buffet per minute)
    const arrivalRateAtPeak = peakConcurrentDiners / 10; // peak over ~10 min window

    // 5. Calculate Wait Time (2-10 minute realistic range)
    let avgWaitTime;
    if (serviceRate >= arrivalRateAtPeak) {
        // Good capacity - minimal wait
        avgWaitTime = 2 + Math.random() * 1; // 2-3 min
    } else {
        // Congestion - longer wait
        const congestionFactor = arrivalRateAtPeak / serviceRate;
        avgWaitTime = Math.min(2 + (4 * congestionFactor), 10); // Cap at 10 min
    }
    avgWaitTime = Math.round(avgWaitTime * 10) / 10; // Round to 1 decimal

    // 6. Max Queue Length
    const maxQueueLength = Math.max(0, peakConcurrentDiners - buffetCapacity);

    // 7. Path-based congestion tracking (simplified)
    const pathDensityMap = new Map();

    // Simulate guest paths
    const sampleAgents = [];
    for (let i = 0; i < Math.min(50, guestCount); i++) {
        const agent = new Agent(i, entry);

        // Path: entry → random table → random buffet → exit
        const table = tables[Math.floor(Math.random() * tables.length)];
        const buffet = buffets[Math.floor(Math.random() * buffets.length)];

        // Simulate movement
        while (!agent.moveTo(table.x, table.y)) {
            const zone = `${Math.floor(agent.x / 5)}-${Math.floor(agent.y / 5)}`;
            pathDensityMap.set(zone, (pathDensityMap.get(zone) || 0) + 1);
        }

        while (!agent.moveTo(buffet.x, buffet.y)) {
            const zone = `${Math.floor(agent.x / 5)}-${Math.floor(agent.y / 5)}`;
            pathDensityMap.set(zone, (pathDensityMap.get(zone) || 0) + 1);
        }

        while (!agent.moveTo(exit.x, exit.y)) {
            const zone = `${Math.floor(agent.x / 5)}-${Math.floor(agent.y / 5)}`;
            pathDensityMap.set(zone, (pathDensityMap.get(zone) || 0) + 1);
        }

        sampleAgents.push(agent);
    }

    // Identify congestion zones (high traffic areas)
    const sampleSize = sampleAgents.length;
    const congestionThreshold = sampleSize * 0.3; // 30% of agents pass through

    const congestionZones = Array.from(pathDensityMap.entries())
        .filter(([_, count]) => count > congestionThreshold)
        .map(([zone, count]) => {
            const [x, y] = zone.split('-').map(Number);
            return {
                x: x * 5,
                y: y * 5,
                severity: Math.min(count / sampleSize, 1),
                percentTraffic: Math.round((count / sampleSize) * 100)
            };
        })
        .slice(0, 5); // Top 5 congestion zones

    // Generate business-realistic recommendations
    const recommendations = generateRecommendations({
        guestCount,
        duration,
        avgWaitTime,
        peakConcurrentDiners,
        maxQueueLength,
        totalBuffetLengthFt,
        buffetCapacity,
        congestionZones,
        venueSqFt
    });

    return {
        success: true,
        congestionZones,
        recommendations,
        metrics: {
            avgWaitTime: avgWaitTime.toFixed(1),
            peakDiners: peakConcurrentDiners,
            congestionZones: congestionZones.length,
            serviceCapacity: buffetCapacity
        }
    };
};

/**
 * Generate business-realistic recommendations with confidence levels
 */
const generateRecommendations = (data) => {
    const {
        guestCount,
        avgWaitTime,
        peakConcurrentDiners,
        totalBuffetLengthFt,
        congestionZones
    } = data;

    // STAFF RECOMMENDATION
    // Industry standard: 1 server per 40-50 guests for buffet service
    let baseRatio = 45;
    let staffConfidence = 'High';
    let staffReason;

    if (avgWaitTime > 6) {
        // Poor layout efficiency - need more staff
        baseRatio = 35;
        staffConfidence = 'Medium';
        staffReason = `For ${guestCount} guests with ${avgWaitTime.toFixed(1)} minute wait times, we recommend 1 server per 35 guests. Your layout shows congestion that additional staff can help manage.`;
    } else if (avgWaitTime < 3) {
        // Efficient layout - can use fewer staff
        baseRatio = 50;
        staffReason = `For ${guestCount} guests with efficient ${avgWaitTime.toFixed(1)} minute wait times, industry standard of 1 server per 50 guests is appropriate.`;
    } else {
        // Standard scenario
        staffReason = `For ${guestCount} guests with buffet service, industry standard suggests 1 server per 40-45 guests. Your wait times (${avgWaitTime.toFixed(1)} min) are within normal range.`;
    }

    const staffCount = Math.ceil(guestCount / baseRatio);

    // BUFFET LENGTH RECOMMENDATION
    // Industry standard: 1ft per 10 guests (minimum), 1.5ft per 10 guests (comfortable)
    const minBuffetLength = Math.ceil(guestCount / 10);
    const comfortableLength = Math.ceil(guestCount * 1.5 / 10);

    let buffetReason;
    let buffetConfidence = 'High';
    let recommendedLength;

    if (totalBuffetLengthFt < minBuffetLength) {
        recommendedLength = minBuffetLength;
        buffetReason = `Current ${totalBuffetLengthFt}ft is below minimum. For ${guestCount} guests, industry standard requires at least ${minBuffetLength}ft. Extending buffet will significantly reduce wait times.`;
    } else if (totalBuffetLengthFt < comfortableLength) {
        recommendedLength = comfortableLength;
        buffetReason = `Current ${totalBuffetLengthFt}ft meets minimum requirements but ${comfortableLength}ft would provide comfortable service for ${guestCount} guests and reduce peak congestion.`;
    } else {
        recommendedLength = totalBuffetLengthFt;
        buffetReason = `Current ${totalBuffetLengthFt}ft is excellent for ${guestCount} guests. Your buffet length exceeds industry standards for comfortable service.`;
    }

    // PLATE COUNT RECOMMENDATION
    // Simple formula: guests + 15-20% buffer
    const plateBuffer = Math.ceil(guestCount * 0.18); // 18% buffer
    const totalPlates = guestCount + plateBuffer;

    const plateReason = `Plan for ${guestCount} guests plus ${plateBuffer} extra plates (18% buffer) to account for replacements, accidents, and guests taking multiple trips. This follows standard catering practice.`;
    const plateConfidence = 'High';

    return {
        staff: {
            count: staffCount,
            reason: staffReason,
            confidence: staffConfidence
        },
        buffet: {
            recommendedLength,
            currentLength: totalBuffetLengthFt,
            reason: buffetReason,
            confidence: buffetConfidence
        },
        plates: {
            total: totalPlates,
            buffer: plateBuffer,
            reason: plateReason,
            confidence: plateConfidence
        }
    };
};

/**
 * API endpoint handler
 */
const simulate = async (req, res) => {
    try {
        const { layout, guestCount, duration } = req.body;

        // Validate required fields
        if (!layout || !guestCount || !duration) {
            return res.status(400).json({
                error: 'Missing required fields: layout, guestCount, duration'
            });
        }

        // Validate guest count
        if (guestCount < 10 || guestCount > 500) {
            return res.status(400).json({
                error: 'Guest count must be between 10 and 500'
            });
        }

        // Validate duration
        if (duration < 1 || duration > 8) {
            return res.status(400).json({
                error: 'Duration must be between 1 and 8 hours'
            });
        }

        // Run simulation
        const results = simulateEvent(layout, guestCount, duration);

        if (results.error) {
            return res.status(400).json(results);
        }

        return res.status(200).json(results);

    } catch (error) {
        console.error('Simulation error:', error);
        return res.status(500).json({
            error: 'Event simulation failed. Please review your layout and try again.'
        });
    }
};

module.exports = {
    simulate
};
