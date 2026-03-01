const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function runTests() {
    try {
        console.log('--- Testing Admin Login ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('✅ Login successful');
        console.log('Token:', token);

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        console.log('\n--- Testing Agent Creation ---');
        const agentRes = await axios.post(`${API_URL}/agents`, {
            name: 'Agent One',
            email: 'agent1@test.com',
            mobile: '+911234567890',
            password: 'password123'
        }, config);
        console.log('✅ Agent created:', agentRes.data.data.agent.name);

        console.log('\n--- Testing Get All Agents ---');
        const listRes = await axios.get(`${API_URL}/agents`, config);
        console.log('✅ Agents found:', listRes.data.results);

        console.log('\n--- Testing CSV Upload Preview ---');
        const FormData = require('form-data');
        const fs = require('fs');
        const form = new FormData();
        form.append('file', fs.createReadStream('test.csv'));

        const uploadRes = await axios.post(`${API_URL}/upload/preview`, form, {
            headers: {
                ...config.headers,
                ...form.getHeaders()
            }
        });
        console.log('✅ CSV Upload successful');
        console.log('Parsed rows:', uploadRes.data.results);
        console.log('First row:', uploadRes.data.data.tasks[0]);

        console.log('\n🎉 All tests passed for Tasks 6-15!');
    } catch (error) {
        console.error('❌ Test failed:');
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

runTests();
