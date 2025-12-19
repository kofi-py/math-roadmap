document.addEventListener('DOMContentLoaded', () => {
    const postData = localStorage.getItem('currentPost');
    const container = document.getElementById('questionContent');

    if (!postData) {
        container.innerHTML = `
            <div class="question-card">
                <h2>Question not found</h2>
                <p>Seems like you got lost. Go back to <a href="forum.html">forum</a>.</p>
            </div>
        `;
        return;
    }

    const post = JSON.parse(postData);

    // Generate Tags HTML
    const tagsHtml = post.tags ? post.tags.split(',').map(tag =>
        `<span class="tag">${tag.trim()}</span>`
    ).join('') : '';

    container.innerHTML = `
        <div class="question-card">
            <h1 class="question-title">${post.title}</h1>
            <div class="question-meta">
                <span class="author-badge">👤 ${post.author}</span>
                <span>📅 ${post.timestamp}</span>
                ${post.isStatic ? '' : `<span>🆔 #${post.id}</span>`}
            </div>
            
            <div class="question-body">
                ${post.body}
            </div>

            ${tagsHtml ? `<div class="tags-container">${tagsHtml}</div>` : ''}
        </div>
    `;

    // Trigger MathJax re-render
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});
