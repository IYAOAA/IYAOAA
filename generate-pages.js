const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));
const postsPerPage = 6;
const totalPages = Math.ceil(posts.length / postsPerPage);

const baseTemplate = fs.readFileSync('index.html', 'utf8');

for (let page = 1; page <= totalPages; page++) {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = posts.slice(start, end);

  const postsHTML = pagePosts.map(post => `
    <article class="post">
      <img src="${post.image}" alt="${post.title}" class="post-image">
      <h2 class="post-title">
        <a href="post.html?id=${post.id}">${post.title}</a>
      </h2>
      <p class="post-meta">Posted on ${new Date(post.date).toDateString()} • by Ibrahim</p>
      <p class="post-excerpt">${post.summary}</p>
      <div class="post-tags">
        ${post.categories.map(cat => `<a href="#">${cat}</a>`).join(' ')}
      </div>
      <a href="post.html?id=${post.id}" class="read-more">Read more →</a>
    </article>
  `).join('');

  let paginationHTML = '';
  if (page > 1) paginationHTML += `<a href="page${page - 1}.html" class="prev">← Previous</a>`;
  if (page < totalPages) paginationHTML += `<a href="page${page + 1}.html" class="next">Next →</a>`;

  const finalHTML = baseTemplate
    .replace('<div id="posts-container" class="post-grid"></div>', `<div id="posts-container" class="post-grid">${postsHTML}</div>`)
    .replace('</main>', `<div class="pagination">${paginationHTML}</div></main>`);

  const filename = page === 1 ? 'index.html' : `page${page}.html`;
  fs.writeFileSync(filename, finalHTML, 'utf8');
  console.log(`Generated: ${filename}`);
}

console.log('✅ All pages generated.');
