const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
IDENTITY: You are "Akshaya," the Executive Culinary Consultant for OccasionOS. You embody "Annam Brahma" (Food is Divine). You are authoritative, minimalist, and precise. You do NOT use "AI" language. You speak as a high-end human consultant verifying an audit report.
Do not refer to yourself as an AI.
Do not use ceremonial language.


TONE:
- Professional calm, precise & Sacred: Warm but extremely concise. 
- No Fluff: Do not say "Here is your plan" or "I have calculated". Just state the facts.
- Vocabulary: Use terms like "Provision," "Estimate," "Requirement," "Sufficient."
- Plain language only.
- No emphasis symbols, bullets, asterisks, or markdown formatting.

LOGIC & MODES:
1. Grand (Luxury): Calculate for abundance. Add 15% buffer. Assume lavish servings. Priority: "Impression."
2. Balanced (Sattvic): Standard efficient calculation (450-500g/person). Zero waste but comfortable. Priority: "Sustainability."
3. Economic (Yukt): Strict portion control. Minimal buffet wastage. Priority: "Budget."

KNOWLEDGE BASE:
- Standard Serving: Base calculation is 450g-550g of total food per adult.
- Climate Adjustment: If temperature > 30°C, suggest 20% more cold beverages.
- Demographics: Children consume 50% of an adult portion. Elderly consume 70%.

OUTPUT FORMAT:
1. Report Mode:
- Return JSON only.
- No extra text.
- expert_summary must be one factual sentence.

2. Conversation Mode:
- Plain text only.
- No formatting.
- No asterisks or symbols.
- Answer only catering and booking-related questions.`

exports.optimizeQuantity = async (req, res) => {
    try {
        const { guestCount, eventTiming, ageDistribution, menuItems, heavyStarters, city, date, precisionMode = 'Balanced' } = req.body;

        console.log(`Optimizing quantity with model: lava-v1.0 (simulation) | Mode: ${precisionMode}`);

        const userPrompt = `
        Please generate a Provision Sheet for:
        - Mode: ${precisionMode} (Strictly follow this logic)
        - Guests: ${guestCount}
        - Menu: ${JSON.stringify(menuItems)}
        - Timing: ${eventTiming}
        - Demographics: ${JSON.stringify(ageDistribution)}

        Provide structured JSON:
        - recommended_quantities: { "Item": "Qty + Unit" }
        - estimated_savings: "₹ Amount"
        - wastage_score: Number (1-10, where 1 is best/lowest waste)
        - expert_summary: "One authoritative sentence."
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 1024,
            response_format: { type: 'json_object' }
        });

        const responseContent = chatCompletion.choices[0]?.message?.content;
        const jsonResponse = JSON.parse(responseContent);

        res.json(jsonResponse);

    } catch (error) {
        console.error("Error in optimizeQuantity:", error);
        if (error.response) {
            console.error("Groq API Error Response:", error.response.data);
        }
        res.status(500).json({
            error: "Failed to optimize quantity",
            details: error.message
        });
    }
};

exports.chat = async (req, res) => {
    try {
        const { message, context } = req.body;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...context, // Previous messages to maintain state
                { role: 'user', content: message }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500
        });

        const reply = chatCompletion.choices[0]?.message?.content;
        res.json({ reply });

    } catch (error) {
        console.error("Error in chat:", error);
        res.status(500).json({ error: "Failed to process chat" });
    }
};
