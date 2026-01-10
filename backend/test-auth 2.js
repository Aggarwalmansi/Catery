const fetch = require('node-fetch'); // You might need to install node-fetch if on older node, but let's try assuming native fetch or install it. 
// Actually Node 18+ has native fetch.

async function testAuth() {
    const baseUrl = 'http://localhost:5000/api/auth';
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    console.log('--- Testing Registration ---');
    const regRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email, password }),
    });

    if (!regRes.ok) {
        console.error('Registration failed:', await regRes.text());
        return;
    }

    const regData = await regRes.json();
    console.log('Registration Success:', regData);
    const token = regData.token;

    console.log('\n--- Testing Login ---');
    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    console.log('Login Success:', loginData);

    console.log('\n--- Testing Protected Route (/me) ---');
    const meRes = await fetch(`${baseUrl}/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!meRes.ok) {
        console.error('Me failed:', await meRes.text());
        return;
    }

    const meData = await meRes.json();
    console.log('Me Success:', meData);
}

testAuth();
