document.addEventListener('DOMContentLoaded', async () => {
  const projectGrid = document.getElementById('projectGrid');
  if (!projectGrid) return;

  const projects = await fetchProjects();
  projectGrid.innerHTML = projects.map((project) => renderProjectCard(project)).join('');

  document.querySelectorAll('[data-enquire-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const projectName = button.dataset.enquireProject;
      openModal({ project: projectName, message: `Hi, I am interested in ${projectName}. Please send plot details.` });
    });
  });
});

function renderProjectCard(project) {
  const thumbnail = project.gallery[0]?.url || 'https://picsum.photos/seed/default/900/600';
  return `
    <article class="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div class="overflow-hidden rounded-[1.75rem]">
        <img src="${thumbnail}" alt="${project.name} residential plot view" loading="lazy" class="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div class="mt-5 space-y-4">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-emerald-600">${project.location}</p>
          <h3 class="mt-3 text-xl font-semibold text-slate-900">${project.name}</h3>
        </div>
        <p class="text-sm text-slate-600">Starting at <span class="font-semibold text-slate-900">${formatRupee(project.pricePerSqYd)}/sq.yd</span></p>
        <div class="grid gap-3 sm:grid-cols-2">
          <a href="detail.html?slug=${project.slug}" class="inline-flex items-center justify-center rounded-full border border-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">View Details</a>
          <button data-enquire-project="${project.name}" class="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Enquire</button>
        </div>
      </div>
    </article>
  `;
}
