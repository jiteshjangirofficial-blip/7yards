async function fetchPhotos() {
  try {
    const response = await fetch('data/photos.json');
    if (!response.ok) throw new Error('Photo data unavailable');
    return await response.json();
  } catch (error) {
    console.error('Unable to load photo metadata:', error);
    return {};
  }
}

async function fetchProjects() {
  try {
    const [projectResponse, photoResponse] = await Promise.all([
      fetch('data/projects.json'),
      fetch('data/photos.json')
    ]);

    if (!projectResponse.ok) throw new Error('Project data unavailable');
    if (!photoResponse.ok) throw new Error('Photo metadata unavailable');

    const [projects, photos] = await Promise.all([projectResponse.json(), photoResponse.json()]);

    return projects.map((project) => {
      if (Array.isArray(project.galleryIds)) {
        project.gallery = project.galleryIds.map((id) => {
          const source = photos[project.slug] || [];
          return source.find((item) => item.id === id) || {
            url: `assets/photos/${project.slug}/${id}.svg`,
            alt: `Premium view of ${project.name}`
          };
        });
      }
      return project;
    });
  } catch (error) {
    console.error('Unable to load projects:', error);
    return [];
  }
}

function formatRupee(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function openModal(prefill = {}) {
  const backdrop = document.getElementById('modalBackdrop');
  const form = document.getElementById('leadForm');
  if (!backdrop || !form) return;
  backdrop.classList.remove('hidden');
  backdrop.classList.add('flex');
  if (prefill.project) form.project.value = prefill.project;
  if (prefill.message) form.message.value = prefill.message;
  if (prefill.name) form.name.value = prefill.name;
  if (prefill.phone) form.phone.value = prefill.phone;
}

function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('flex');
  backdrop.classList.add('hidden');
}

function initializeModal() {
  const modalOpeners = document.querySelectorAll('[data-action="open-modal"]');
  modalOpeners.forEach((button) => {
    button.addEventListener('click', () => openModal({
      project: button.dataset.project || '',
      message: button.dataset.message || ''
    }));
  });

  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);

  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal();
  });

  const leadForm = document.getElementById('leadForm');
  if (!leadForm) return;
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      project: formData.get('project'),
      message: formData.get('message')
    };

    console.info('Lead captured:', data);
    const success = document.getElementById('leadSuccess');
    if (success) {
      success.textContent = 'Thank you! Your enquiry has been received. Our team will contact you shortly.';
      success.classList.remove('hidden');
    }
    leadForm.reset();
    setTimeout(() => {
      if (success) success.classList.add('hidden');
      closeModal();
    }, 3000);
  });
}

function initializeMobileNav() {
  const menuButton = document.getElementById('mobileMenuButton');
  const mobileNav = document.getElementById('mobileNav');
  if (!menuButton || !mobileNav) return;
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}

function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initializeAdminForm() {
  const projectForm = document.getElementById('projectForm');
  const downloadLink = document.getElementById('downloadLink');
  const adminStatus = document.getElementById('adminStatus');

  if (!projectForm || !downloadLink) return;

  projectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const newProject = {
      slug: (formData.get('slug') || '').toString().trim(),
      name: (formData.get('name') || '').toString().trim(),
      location: (formData.get('location') || '').toString().trim(),
      pricePerSqYd: Number(formData.get('pricePerSqYd')),
      gallery: (formData.get('galleryIds') || '').toString().split(',').map((id) => id.trim()).filter(Boolean).map((id) => ({ url: `https://picsum.photos/id/${id}/1920/1080`, alt: `Premium plot view at ${formData.get('name')}` })),
      description: (formData.get('description') || '').toString().trim(),
      propertyDetails: {
        ownership: (formData.get('ownership') || '').toString().trim(),
        superArea: (formData.get('superArea') || '').toString().trim(),
        length: (formData.get('length') || '').toString().trim(),
        breadth: (formData.get('breadth') || '').toString().trim(),
        widthOfFacingRoad: (formData.get('widthOfFacingRoad') || '').toString().trim(),
        facing: (formData.get('facing') || '').toString().trim(),
        gatedCommunity: (formData.get('gatedCommunity') || '').toString().trim(),
        openSides: (formData.get('openSides') || '').toString().trim(),
        cornerPlot: (formData.get('cornerPlot') || '').toString().trim(),
        boundaryWall: (formData.get('boundaryWall') || '').toString().trim(),
        waterSupply: (formData.get('waterSupply') || '').toString().trim(),
        electricity: (formData.get('electricity') || '').toString().trim(),
        roadType: (formData.get('roadType') || '').toString().trim(),
        possession: (formData.get('possession') || '').toString().trim()
      },
      amenities: (formData.get('amenities') || '').toString().split(',').map((item) => item.trim()).filter(Boolean),
      availablePlotSizes: [100, 150, 200, 250]
    };

    const existing = await fetchProjects();
    const updated = [...existing.filter((project) => project.slug !== newProject.slug), newProject];
    const blob = new Blob([JSON.stringify(updated, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'projects-updated.json';
    downloadLink.textContent = 'Download JSON';
    downloadLink.classList.remove('hidden');
    if (adminStatus) adminStatus.textContent = 'Updated JSON is ready. Download and replace data/projects.json with this file.';
  });
}

function initializeApp() {
  initializeModal();
  initializeMobileNav();
  enableSmoothScroll();
  initializeAdminForm();
}

document.addEventListener('DOMContentLoaded', initializeApp);
