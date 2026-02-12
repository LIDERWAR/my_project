
document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const paginationContainer = document.getElementById('pagination');
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;

    // Only run if we are on the blog page with the grid container
    if (blogGrid && paginationContainer && typeof blogPosts !== 'undefined') {
        renderBlog(currentPage);
    }

    function renderBlog(page) {
        // Calculate start and end indices
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedPosts = blogPosts.slice(start, end);

        // Clear grid
        blogGrid.innerHTML = '';

        // Render posts
        paginatedPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-card fade-up';
            article.innerHTML = `
                <a href="article.html?id=${post.id}" class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                </a>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${post.date}</span>
                        <span class="blog-tag">${post.category}</span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="article.html?id=${post.id}" class="blog-link">Подробнее →</a>
                </div>
            `;
            blogGrid.appendChild(article);
        });

        // Trigger animations for new elements
        if (typeof fadeObserver !== 'undefined') {
            document.querySelectorAll('.blog-card.fade-up').forEach(el => {
                fadeObserver.observe(el);
            });
        }

        renderPagination(page);
    }

    function renderPagination(page) {
        const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = `pagination-btn ${page === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '&larr;';
        prevBtn.disabled = page === 1;
        prevBtn.addEventListener('click', () => {
            if (page > 1) {
                currentPage = page - 1;
                renderBlog(currentPage);
                scrollToTop();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === page ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderBlog(currentPage);
                scrollToTop();
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = `pagination-btn ${page === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '&rarr;';
        nextBtn.disabled = page === totalPages;
        nextBtn.addEventListener('click', () => {
            if (page < totalPages) {
                currentPage = page + 1;
                renderBlog(currentPage);
                scrollToTop();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    function scrollToTop() {
        const section = document.querySelector('.blog-grid-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Single Article Logic
document.addEventListener('DOMContentLoaded', () => {
    const articleBody = document.querySelector('.article-body');
    const articleHero = document.querySelector('.article-hero');

    // Check if we are on article page and have blogPosts data
    if (articleBody && typeof blogPosts !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('id'));

        if (articleId) {
            const post = blogPosts.find(p => p.id === articleId);

            if (post) {
                // Update Metadata
                document.title = `${post.title} - A-SPACE`;
                document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);

                // Update Hero content
                document.querySelector('.article-title').textContent = post.title;
                document.querySelector('.blog-date').textContent = post.date;
                document.querySelector('.blog-tag').textContent = post.category;

                // Update Body Content
                // Keep the image if it matches your template, or update it
                const mainImage = articleBody.querySelector('.article-main-image');
                if (mainImage) {
                    mainImage.src = post.image;
                    mainImage.alt = post.title;
                }

                // Inject content
                // We keep the image, then replace the rest or append?
                // The template has specific structure (image, then lead text, then h2...).
                // Our data.content has HTML. Let's replace the content AFTER the image.

                // Simplified approach: Clear body except image, then append content
                // OR construct the innerHTML fully.

                // Let's replace the text content part.
                // Assuming the template structure in article.html is consistent.

                // Construct new HTML
                const newContent = `
                    <img src="${post.image}" alt="${post.title}" class="article-main-image">
                    ${post.content}
                    <div class="article-share">
                        <p>Понравилась статья? Поделитесь ей:</p>
                        <div class="share-buttons">
                            <button class="btn-share">Telegram</button>
                            <button class="btn-share">WhatsApp</button>
                            <button class="btn-share">VK</button>
                        </div>
                    </div>
                `;

                articleBody.innerHTML = newContent;

            } else {
                // Not found
                articleBody.innerHTML = '<div class="container"><h2>Статья не найдена</h2><a href="blog.html" class="btn-primary">Вернуться в блог</a></div>';
            }
        }
    }
});
