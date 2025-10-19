const fs = require('fs');
const path = require('path');

// Configuration
const postsPerPage = 6;
const postsFile = path.join(__dirname, 'data', 'posts.json');
const templateFile = path.join(__dirname, 'index.html');
const sitemapFile = path.join(__dirname, 'sitemap.xml');

// Load posts
const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
const totalPages = Math.ceil(posts.length / postsPerPage);

// Load template
const template = fs.readFileSync(templateFile, 'utf8');

// Array to track generated pages for sitemap
let pagesForSitemap = ['index.html'];

// Generate pages
for (let page = 1; page <= totalPages; page++) {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = posts.slice(start, end);

  // Generate HTML for this page's posts
  const postsHTML = pagePosts.map(post => `
    <article class="post">
      <img src="${post.image}" alt="${post.title}" class="post-image">
      <h2 class="post-title"><a href="post.html?id=${post.id}">${post.title}</a></h2>
      <p class="post-meta">Posted on ${new Date(post.date).toDateString()} • by Ibrahim</p>
      <p class="post-excerpt">${post.summary}</p>
      <div class="post-tags">
        ${post.categories.map(cat => `<a href="#">${cat}</a>`).join(' ')}
      </div>
      <a href="post.html?id=${post.id}" class="read-more">Read more →</a>
    </article>
  `).join('');

  // Generate pagination links
  let paginationHTML = '';
  if (page > 1) paginationHTML += `<a href="${page === 2 ? 'index.html' : 'page' + (page - 1) + '.html'}" class="prev">← Previous</a>`;
  if (page < totalPages) paginationHTML += `<a href="page${page + 1}.html" class="next">Next →</a>`;

  // Inject posts into template safely
  const containerRegex = /<div id="posts-container" class="post-grid">.*?<\/div>/s;
  const finalHTML = template
    .replace(containerRegex, `<div id="posts-container" class="post-grid">${postsHTML}</div>`)
    .replace('</main>', `<div class="pagination">${paginationHTML}</div></main>`);

  // Decide filename
  const filename = page === 1 ? 'index.html' : `page${page}.html`;
  pagesForSitemap.push(filename);

  fs.writeFileSync(path.join(__dirname, filename), finalHTML, 'utf8');
  console.log(`Generated: ${filename}`);
}

// Update sitemap.xml
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

pagesForSitemap.forEach(pageFile => {
  sitemapContent += `  <url>\n`;
  sitemapContent += `    <loc>https://iyaoaa.netlify.app/${pageFile}</loc>\n`;
  sitemapContent += `  </url>\n`;
});

sitemapContent += `</urlset>`;

fs.writeFileSync(sitemapFile, sitemapContent, 'utf8');
console.log('✅ sitemap.xml updated.');
console.log('✅ All pages generated successfully.');
