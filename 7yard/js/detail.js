document.addEventListener('DOMContentLoaded', async () => {
  const slug = getQueryParam('slug');
  const contentRoot = document.getElementById('projectContent');
  if (!contentRoot) return;

  if (!slug) {
    contentRoot.innerHTML = `<div class="rounded-[2rem] bg-white p-8 shadow-soft text-center"><h1 class="text-3xl font-semibold text-slate-900">Project not found</h1><p class="mt-4 text-slate-600">Please return to the homepage and select a valid project.</p><a href="index.html" class="mt-6 inline-flex rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Return Home</a></div>`;
    return;
  }

  const projects = await fetchProjects();
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    contentRoot.innerHTML = `<div class="rounded-[2rem] bg-white p-8 shadow-soft text-center"><h1 class="text-3xl font-semibold text-slate-900">Project not found</h1><p class="mt-4 text-slate-600">The requested project does not exist in our current listings.</p><a href="index.html" class="mt-6 inline-flex rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Return Home</a></div>`;
    return;
  }

  renderProjectDetails(project);
  updateMetaTags(project);
  renderJSONLD(project);
});

function renderProjectDetails(project) {
  const contentRoot = document.getElementById('projectContent');
  const galleryThumbnails = project.gallery.map((image, idx) => `<button type="button" data-image="${image.url}" class="group overflow-hidden rounded-3xl border border-slate-200 transition hover:border-emerald-500"><img src="${image.url}" alt="${image.alt}" loading="lazy" class="h-24 w-full object-cover transition duration-300 group-hover:scale-105" /></button>`).join('');

  contentRoot.innerHTML = `
    <section class="space-y-8">
      <div class="flex flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-soft lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-emerald-600">${project.location}</p>
          <h1 class="mt-3 text-3xl font-semibold text-slate-900">${project.name}</h1>
          <p class="mt-3 max-w-2xl text-slate-600">${project.description}</p>
        </div>
        <div class="rounded-[1.75rem] bg-slate-50 p-6 text-center">
          <p class="text-sm uppercase tracking-[0.32em] text-slate-500">Price / sq.yd</p>
          <p class="mt-3 text-4xl font-semibold text-slate-900">${formatRupee(project.pricePerSqYd)}</p>
          <p class="mt-2 text-sm text-slate-600">Available plot sizes 100–250 sq.yd</p>
        </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div class="space-y-6">
          <div class="rounded-[2rem] bg-white p-6 shadow-soft">
            <div class="overflow-hidden rounded-[1.75rem]">
              <img id="mainGalleryImage" src="${project.gallery[0]?.url}" alt="${project.gallery[0]?.alt}" loading="lazy" class="h-[420px] w-full object-cover" />
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-4">${galleryThumbnails}</div>
          </div>

          <div class="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 class="text-2xl font-semibold text-slate-900">Property Details</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              ${Object.entries(project.propertyDetails).map(([key, value]) => renderDetailRow(formatLabel(key), value)).join('')}
            </div>
          </div>

          <div class="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 class="text-2xl font-semibold text-slate-900">Amenities</h2>
            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              ${project.amenities.map((amenity) => `<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">${amenity}</div>`).join('')}
            </div>
          </div>
        </div>
        <aside class="space-y-6">
          <div class="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 class="text-2xl font-semibold text-slate-900">Available Plot Sizes</h2>
            <div class="mt-6 space-y-4">
              ${project.availablePlotSizes.map((size) => renderPlotCard(project, size)).join('')}
            </div>
          </div>

          <div class="rounded-[2rem] bg-emerald-500/10 p-6 shadow-soft">
            <h2 class="text-2xl font-semibold text-slate-900">Why Buy Here</h2>
            <ul class="mt-5 space-y-3 text-slate-700">
              <li>• Prime Jaipur location with infrastructure access.</li>
              <li>• Clear title plots and trusted gated community.</li>
              <li>• Ideal for family homes and investment growth.</li>
            </ul>
          </div>
          <a href="index.html" class="inline-flex w-full items-center justify-center rounded-full border border-emerald-500 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Back to Homepage</a>
        </aside>
      </div>
    </section>
  `;

  initializeGallery();
}

function renderDetailRow(label, value) {
  return `
    <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">${label}</p>
      <p class="mt-2 text-base font-semibold text-slate-900">${value}</p>
    </div>
  `;
}

function renderPlotCard(project, size) {
  const totalPrice = size * project.pricePerSqYd;
  const message = `Hi, I am interested in ${project.name} - ${size} sq.yd plot at 7Yards. Please send details.`;
  return `
    <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p class="text-sm uppercase tracking-[0.32em] text-emerald-600">Plot Size</p>
      <p class="mt-3 text-3xl font-semibold text-slate-900">${size} sq.yd</p>
      <p class="mt-4 text-sm text-slate-600">Price per sq.yd</p>
      <p class="font-semibold text-slate-900">${formatRupee(project.pricePerSqYd)}</p>
      <p class="mt-4 text-sm text-slate-600">Total Price</p>
      <p class="text-xl font-semibold text-slate-900">${formatRupee(totalPrice)}</p>
      <button type="button" data-action="open-modal" data-project="${project.name} - ${size} sq.yd" data-message="Hi, I am interested in ${project.name} - ${size} sq.yd plot at 7Yards. Please send details." class="mt-6 w-full rounded-full border border-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Request Details</button>
    </div>
  `;
}

function initializeGallery() {
  const mainImage = document.getElementById('mainGalleryImage');
  const thumbnails = document.querySelectorAll('[data-image]');
  if (!mainImage || !thumbnails.length) return;
  thumbnails.forEach((button) => {
    button.addEventListener('click', () => {
      const src = button.dataset.image;
      mainImage.src = src;
      mainImage.alt = button.querySelector('img')?.alt || mainImage.alt;
      thumbnails.forEach((item) => item.classList.remove('ring-2', 'ring-emerald-500'));
      button.classList.add('ring-2', 'ring-emerald-500');
    });
  });
  thumbnails[0].classList.add('ring-2', 'ring-emerald-500');
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)/g, '$1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase());
}

function updateMetaTags(project) {
  document.title = `${project.name} | Premium Plots in Jaipur`;
  const description = `Explore ${project.name} in ${project.location}. Plot sizes 100-250 sq.yd with gated community features and premium amenities.`;
  updateMeta('description', description);
  updateMeta('keywords', `7Yards plots, ${project.name}, residential plots Jaipur, buy plots Jaipur Rajasthan, gated community plots`);
  updateMeta('og:title', `${project.name} | 7Yards Jaipur`);
  updateMeta('og:description', description);
  updateMeta('twitter:title', `${project.name} | 7Yards Jaipur`);
  updateMeta('twitter:description', description);
}

function updateMeta(name, content) {
  const selector = `meta[name="${name}"]`, propertySelector = `meta[property="${name}"]`;
  let element = document.querySelector(selector) || document.querySelector(propertySelector);
  if (!element) {
    element = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function renderJSONLD(project) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': project.name,
    'description': project.description,
    'url': window.location.href,
    'image': project.gallery.map((image) => image.url),
    'offers': project.availablePlotSizes.map((size) => ({
      '@type': 'Offer',
      'name': `${size} sq.yd plot`,
      'price': size * project.pricePerSqYd,
      'priceCurrency': 'INR',
      'eligibleQuantity': {
        '@type': 'QuantitativeValue',
        'value': size,
        'unitCode': 'SQYRD'
      }
    }))
  }, null, 2);
  document.head.appendChild(script);
}
