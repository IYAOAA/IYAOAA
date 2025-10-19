// generate-sitemap.js
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://iyaoaa.netlify.app'; // change if you deploy elsewhere
const folders = ['.', 'latest-post']; // add any other folders that have .html files
let urls = [];

folders.forEach(folder => {
  const files = fs.readdirSync(folder);
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const loc = `${baseUrl}/${folder === '.' ? '' : folder + '/'}${file}`;
      urls.push(`  <url><loc>${loc}</loc></url>`);
    }
  });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

fs.writeFileSync(path.join('.', 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml updated successfully.');
