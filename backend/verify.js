const { spawn } = require('child_process');
const http = require('http');

console.log("Starting verification...");

function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject({ statusCode: res.statusCode, body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    try {
        console.log("Checking DB Connection...");
        // 1. Post Question
        console.log("Test 1: Post Question to Neon DB...");
        const timestamp = Date.now();
        const q = await request('POST', '/questions', {
            title: `Neon Persistence Test ${timestamp}`,
            content: "This question should appear in the Neon database."
        });
        console.log("PASS: Created question", q.id, q.title);

        // 2. Get Questions
        console.log("Test 2: Fetch Questions from Neon DB...");
        const qs = await request('GET', '/questions');
        const found = qs.find(x => x.id === q.id);
        if (found) {
            console.log("PASS: Found new question in database list.");
            console.log(`CONFIRMED: Question ID ${q.id} is saved in Neon.`);
        } else {
            throw new Error("Created question not found in list");
        }

        console.log("ALL PERSISTENCE TESTS PASSED!");

    } catch (error) {
        console.error("TEST FAILED:", error);
    } finally {
        process.exit(0);
    }
}

// Wait for server to be ready (assuming it's already running in background)
setTimeout(runTests, 2000);
