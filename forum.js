function filterPosts(category) {
    // Remove active class from all categories
    document.querySelectorAll('.category').forEach(cat => {
        cat.classList.remove('active');
    });

    // Add active class to clicked category
    event.target.closest('.category').classList.add('active');

    // Show/hide posts based on category
    const posts = document.querySelectorAll('.post-card');
    posts.forEach(post => {
        if (category === 'all') {
            post.style.display = 'block';
        } else {
            if (post.getAttribute('data-category') === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        }
    });
}

// MathQuill Initialization
var MQ = MathQuill.getInterface(2);
var mathFieldSpan = document.getElementById('math-field');
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function () {
            // enter logic here if needed
        }
    }
});

// Load posts from localStorage on start
window.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    // Add click handlers to existing static posts
    document.querySelectorAll('.post-card').forEach((card, index) => {
        if (!card.getAttribute('onclick')) {
            card.addEventListener('click', function () {
                // Static post simulation
                const title = this.querySelector('.post-title').innerText;
                const author = this.querySelector('.post-author').innerText;
                const body = this.querySelector('.post-excerpt').innerText;
                // Handle tags safely
                let tags = "";
                const tagsContainer = this.querySelector('.post-tags');
                if (tagsContainer) {
                    tags = Array.from(tagsContainer.querySelectorAll('.tag')).map(t => t.innerText).join(',');
                }

                const postData = {
                    title, author, body, tags,
                    timestamp: this.querySelector('.post-meta span:last-child').innerText,
                    isStatic: true
                };
                localStorage.setItem('currentPost', JSON.stringify(postData));
                window.location.href = 'question.html';
            });
        }
    });
});

function openModal() {
    document.getElementById('postModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('postModal').style.display = 'none';
}

function toggleMathEditor() {
    const editor = document.getElementById('mathEditorContainer');
    const btn = document.getElementById('mathToggleBtn');
    const isHidden = editor.style.display === 'none';

    editor.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
        btn.classList.add('active');
        // slight delay to let display block take effect before focus
        setTimeout(() => mathField.focus(), 50);
    } else {
        btn.classList.remove('active');
    }
}

function insertMath() {
    const latex = mathField.latex();
    if (latex) {
        const textarea = document.getElementById('postBody');
        textarea.value += ' \\(' + latex + '\\) ';
        mathField.latex(''); // clear editor

        // Hide and reset toggler
        document.getElementById('mathEditorContainer').style.display = 'none';
        document.getElementById('mathToggleBtn').classList.remove('active');

        textarea.focus();
    }
}

async function submitPost() {
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const bodyLatex = mathField.latex(); // Get LaTeX from MathQuill
    const tags = document.getElementById('postTags').value;

    if (!title || !bodyLatex) {
        alert('Please fill in title and question!');
        return;
    }

    const newPost = {
        title,
        category: category || 'general', // Default if empty
        content: bodyLatex, // Backend expects 'content'
        tags,
        // Backend handles id, timestamp, etc.
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });

        if (response.ok) {
            const savedPost = await response.json();
            // Redirect to the new post using URL ID
            viewPost(savedPost.id);
        } else {
            alert('Error creating post');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to server');
    }
}

// Load posts from backend
const API_URL = 'http://localhost:3000/api/questions';

async function loadPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();
        // Clear existing dynamic posts first (keep static ones if needed? 
        // Actually, the original code prepended. Let's strictly use backend posts or clarify if static posts should remain.
        // The user said "Fetch questions from the backend".
        // I will clear the container of dynamic posts or just append.
        // Let's rely on standard refreshing.

        // Remove existing dynamic posts to avoid duplicates if called multiple times (though currently only called on load)
        // document.querySelectorAll('.dynamic-post').forEach(e => e.remove());

        posts.forEach(post => renderPost(post));
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function renderPost(post) {
    const container = document.getElementById('postsContainer');

    const postHTML = `
                <div class="post-card" data-category="${post.category}" onclick="viewPost(${post.id})">
                    <div class="post-header">
                        <div>
                            <div class="post-title">${post.title}</div>
                            <div class="post-meta">
                                <span class="post-author">User</span>
                                <span>•</span>
                                <span>${new Date(post.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="post-excerpt">
                         ${post.content || post.body} 
                    </div>
                    <div class="post-tags">
                        ${post.tags ? post.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : ''}
                    </div>
                    <div class="post-stats">
                        <div class="stat">
                            <span class="stat-icon">💬</span>
                            <span>${post.replies || 0} replies</span>
                        </div>
                        <div class="stat">
                            <span class="stat-icon">❤️</span>
                            <span>${post.votes || 0} helpful</span>
                        </div>
                    </div>
                </div>
            `;

    // Insert after the start, before static posts
    container.insertAdjacentHTML('afterbegin', postHTML);

    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function viewPost(id) {
    window.location.href = `question.html?id=${id}`;
}