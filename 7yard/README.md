# 7Yards Website

A premium static real estate website for selling residential plots in Jaipur, Rajasthan. This fully responsive site is built with HTML5, Tailwind CSS via CDN, and vanilla JavaScript.

## Project Structure

- `index.html` — Homepage with hero, featured projects, testimonials, why choose 7Yards, lead capture modal, and WhatsApp contact.
- `detail.html` — Dynamic property detail page that loads project data from `data/projects.json` using `?slug=` query parameter.
- `admin.html` — Admin form to add a new project and download updated JSON as `projects-updated.json`.
- `data/projects.json` — JSON array of all project objects.
- `js/app.js` — Shared utilities, data fetching, modal behavior, WhatsApp helpers.
- `js/index.js` — Homepage logic for rendering featured projects and navigation.
- `js/detail.js` — Detail page logic for rendering project content, gallery, pricing, and WhatsApp enquiries.
- `sitemap.xml` — Sitemap for search engines.
- `robots.txt` — Search engine crawl instructions.

## How to Run Locally

1. Open the `7yards-website` folder in VS Code.
2. Install the Live Server extension if not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Visit the site in your browser and test pages:
   - `index.html`
   - `detail.html?slug=eden-gardens`
   - `admin.html`

## Adding New Projects

### Option 1: Edit JSON Directly
1. Open `data/projects.json`.
2. Add a new project object to the array using the same structure as existing entries.
3. Save the file and refresh the site.

### Option 2: Use `admin.html`
1. Open `admin.html` in your browser.
2. Fill the project fields and click **Generate JSON**.
3. Download the generated `projects-updated.json`.
4. Replace the existing `data/projects.json` with the downloaded file.

## WhatsApp Integration

- The floating WhatsApp button on every page opens `https://wa.me/919876543210`.
- Each plot inquiry button generates a pre-filled WhatsApp message with the selected project name and plot size.
- Update the phone number in `js/app.js` if you want to connect a different WhatsApp number.

## SEO Checklist

- Unique page titles for each page.
- Meta description and keywords on every page.
- Open Graph and Twitter card metadata.
- JSON-LD schema on homepage and detail pages.
- Alt text for all images with keyword-rich descriptions.
- Mobile-friendly responsive design and fast-loading images.
- Use `index.html`, `detail.html?slug=...`, and `admin.html` for structured navigation.

## Local SEO Recommendations for Jaipur, Rajasthan

- Add location-specific content with keywords like *Jaipur plots*, *residential plots in Jaipur*, *buy plots Jaipur Rajasthan*, *gated community plots Jaipur*.
- Use page headings and copy that mention Jaipur and Rajasthan naturally.
- Submit the site to Google Search Console with a sitemap.
- Add Business profile details if you promote the site locally.
- Use local directories, citations, and property listing platforms for backlinks.

## Recommended Deployment

Deploy the static site to a fast hosting provider:

- Vercel — great for static HTML and CDN performance.
- Netlify — simple deployment with redirects and form enhancements.
- GitHub Pages — good for lightweight static hosting.

## Next Steps for Ranking

- Add more project pages and property galleries.
- Publish blog content around Jaipur real estate and plot buying tips.
- Include customer testimonials and case studies.
- Use Google Search Console to monitor impressions and fix issues.
- Optimize image sizes and responsive breakpoints for performance.
