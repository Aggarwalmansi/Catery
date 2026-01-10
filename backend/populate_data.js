const API_URL = 'http://localhost:5001/api';

async function request(endpoint, method, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

async function populate() {
    try {
        const timestamp = Date.now();
        const email = `caterer${timestamp}@example.com`;
        const password = 'password123';

        console.log(`1. Registering User: ${email}`);
        await request('/auth/register', 'POST', {
            name: 'Royal Catering',
            email,
            password
        });

        console.log('2. Logging in...');
        const loginRes = await request('/auth/login', 'POST', {
            email,
            password
        });
        let token = loginRes.token;
        console.log('   Logged in, Token:', token.substring(0, 10) + '...');

        console.log('3. Onboarding Vendor...');
        const onboardRes = await request('/vendor/onboard', 'POST', {
            name: 'Royal Catering',
            description: 'Best Indian Catering',
            email: `contact${timestamp}@royal.com`,
            phone: '9876543210',
            address: 'Delhi, India',
            occasions: ['Wedding', 'Birthday']
        }, token);
        token = onboardRes.token;
        console.log('   Onboarded. New Token:', token.substring(0, 10) + '...');

        console.log('4. Creating Menu Items...');
        const items = [
            { name: 'Butter Chicken', description: 'Rich tomato gravy', price: 300, category: 'Main Course', isVeg: false },
            { name: 'Dal Makhani', description: 'Creamy black lentils', price: 200, category: 'Main Course', isVeg: true },
            { name: 'Butter Naan', description: 'Tandoori bread', price: 50, category: 'Breads', isVeg: true },
            { name: 'Jeera Rice', description: 'Basmati rice with cumin', price: 150, category: 'Rice', isVeg: true },
            { name: 'Gulab Jamun', description: 'Sweet dumplings', price: 100, category: 'Dessert', isVeg: true }
        ];

        const createdItems = [];
        for (const item of items) {
            const data = await request('/vendor/menu', 'POST', item, token);
            createdItems.push(data);
            console.log(`   Created: ${item.name} (ID: ${data.id})`);
        }

        console.log('5. Creating Packages...');

        // Silver Package (Dal, Naan, Rice)
        const silverItems = createdItems.filter(i => ['Dal Makhani', 'Butter Naan', 'Jeera Rice'].includes(i.name)).map(i => i.id);
        const silverPkg = await request('/vendor/packages', 'POST', {
            name: 'Silver Budget Package',
            description: 'Perfect for small gatherings',
            price: 450,
            minPlates: 30,
            items: silverItems
        }, token);
        console.log(`   Created: Silver Package (ID: ${silverPkg.id})`);

        // Gold Package (Butter Chicken, Dal, Naan, Rice, Gulab Jamun)
        const goldItems = createdItems.map(i => i.id);
        const goldPkg = await request('/vendor/packages', 'POST', {
            name: 'Gold Wedding Package',
            description: 'Grand feast for weddings',
            price: 800,
            minPlates: 100,
            items: goldItems
        }, token);
        console.log(`   Created: Gold Package (ID: ${goldPkg.id})`);

        console.log('Done! Database populated.');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

populate();
