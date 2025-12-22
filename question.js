const API_URL = 'http://localhost:3000/api/questions';

async function loadQuestion() {
    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        document.getElementById('questionContent').innerHTML = `
            <div class="question-card">
                <h2>Question not found</h2>
                <p>No ID provided. Go back to <a href="forum.html">forum</a>.</p>
            </div>
        `;
        return;
    }

    try {
        // Fetch Question
        const qResponse = await fetch(`${API_URL}/${id}`);
        if (!qResponse.ok) throw new Error('Question not found');
        const post = await qResponse.json();

        // Render Question
        const tagsHtml = post.tags ? post.tags.split(',').map(tag =>
            `<span class="tag">${tag.trim()}</span>`
        ).join('') : '';

        document.getElementById('questionContent').innerHTML = `
            <div class="question-card">
                <h1 class="question-title">${post.title}</h1>
                <div class="question-meta">
                    <span class="author-badge">👤 User</span>
                    <span>📅 ${new Date(post.created_at).toLocaleDateString()}</span>
                    <span>🆔 #${post.id}</span>
                </div>
                
                <div class="question-body">
                    ${post.content || post.body}
                </div>

                ${tagsHtml ? `<div class="tags-container">${tagsHtml}</div>` : ''}
            </div>
        `;

        // Fetch Answers
        loadAnswers(id, post.accepted_answer_id);

    } catch (error) {
        console.error(error);
        document.getElementById('questionContent').innerHTML = `
            <div class="question-card">
                <h2>Error</h2>
                <p>Failed to load question. <a href="forum.html">Go back</a>.</p>
            </div>
        `;
    }
}

async function loadAnswers(questionId, acceptedAnswerId) {
    try {
        const response = await fetch(`${API_URL}/${questionId}/answers`);
        const answers = await response.json();
        const container = document.getElementById('answersContainer');

        if (answers.length === 0) {
            container.innerHTML = '<p style="color: var(--gray);">No answers yet. Be the first!</p>';
            return;
        }

        container.innerHTML = answers.map(answer => {
            const isAccepted = answer.id === acceptedAnswerId;
            const acceptedBadge = isAccepted ?
                `<div style="color: #27ae60; font-weight: bold; margin-bottom: 0.5rem;">&#10003; Accepted Answer</div>` : '';
            const borderStyle = isAccepted ? 'border: 2px solid #27ae60;' : 'border: 1px solid #eee;';

            return `
            <div class="answer-card" style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; ${borderStyle}">
                <div class="post-meta" style="margin-bottom: 0.5rem;">
                    <span>📅 ${new Date(answer.created_at).toLocaleDateString()}</span>
                </div>
                ${acceptedBadge}
                <div class="answer-body">
                    ${answer.body}
                </div>
            </div>
            `;
        }).join('');

        // Trigger MathJax
        if (window.MathJax) {
            MathJax.typesetPromise();
        }

    } catch (error) {
        console.error('Error loading answers:', error);
    }
}

async function submitAnswer() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const content = document.getElementById('answerBody').value;

    if (!content) {
        alert('Please write an answer!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            document.getElementById('answerBody').value = '';
            loadAnswers(id); // Reload answers
        } else {
            alert('Failed to post answer');
        }
    } catch (error) {
        console.error(error);
        alert('Error posting answer');
    }
}

document.addEventListener('DOMContentLoaded', loadQuestion);
