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

function submitPost() {
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const bodyLatex = mathField.latex(); // Get LaTeX from MathQuill
    const tags = document.getElementById('postTags').value;

    if (!title || !bodyLatex) {
        alert('Please fill in title and question!');
        return;
    }

    const newPost = {
        id: Date.now(),
        title,
        category,
        body: bodyLatex, // Store LaTeX
        tags,
        author: 'you',
        timestamp: 'just now',
        replies: 0,
        likes: 0
    };

    // Save to localStorage
    let posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    posts.unshift(newPost);
    localStorage.setItem('forumPosts', JSON.stringify(posts));

    // Redirect to the new post
    viewPost(newPost.id);
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    posts.forEach(post => renderPost(post));
}

function renderPost(post) {
    const container = document.getElementById('postsContainer');

    const postHTML = `
                <div class="post-card" data-category="${post.category}" onclick="viewPost(${post.id})">
                    <div class="post-header">
                        <div>
                            <div class="post-title">${post.title}</div>
                            <div class="post-meta">
                                <span class="post-author">${post.author}</span>
                                <span>•</span>
                                <span>${post.timestamp}</span>
                            </div>
                        </div>
                    </div>
                    <div class="post-excerpt">
                         ${post.body}
                    </div>
                    <div class="post-tags">
                        ${post.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                    </div>
                    <div class="post-stats">
                        <div class="stat">
                            <span class="stat-icon">💬</span>
                            <span>${post.replies} replies</span>
                        </div>
                        <div class="stat">
                            <span class="stat-icon">❤️</span>
                            <span>${post.likes} helpful</span>
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
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const post = posts.find(p => p.id === id);
    if (post) {
        localStorage.setItem('currentPost', JSON.stringify(post));
        window.location.href = 'question.html';
    }
}