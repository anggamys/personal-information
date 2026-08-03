// Global variable to track current language
let currentLang = localStorage.getItem('portfolio_lang') || 'id';

function renderLinks(links) {
  if (!links || links.length === 0) return '';
  return links.map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>`).join(' / ') + '<br>';
}

function renderItem(item) {
  const isPlaceholder = !item.image || item.image.includes('project_placeholder.png');
  
  if (isPlaceholder) {
    return `
    <tr class="item-row">
      <td class="project-content-col" colspan="2" style="padding: 16px; width: 100%; vertical-align: middle">
        <a href="${item.links && item.links.length > 0 ? item.links[0].url : '#'}" ${item.links && item.links.length > 0 ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          <span class="papertitle">${item.title}</span>
        </a>
        <br />
        ${item.role ? `<strong>${item.companyUrl ? `<a href="${item.companyUrl}" target="_blank" rel="noopener noreferrer">${item.role}</a>` : item.role}</strong><br />` : ''}
        <em>${item.event || item.location}</em>, ${item.date}
        <br />
        ${renderLinks(item.links)}
        <p>${item.description}</p>
      </td>
    </tr>
    `;
  }

  return `
  <tr class="item-row" onmouseout="document.getElementById('${item.id}_image').style.opacity = '0'" onmouseover="document.getElementById('${item.id}_image').style.opacity = '1'">
    <td class="project-image-col" style="padding: 16px; width: 25%; vertical-align: middle">
      <a href="${item.links && item.links.length > 0 ? item.links[0].url : '#'}" ${item.links && item.links.length > 0 ? 'target="_blank" rel="noopener noreferrer"' : ''} style="display: block;">
        <div class="one">
          <div class="two" id="${item.id}_image" style="opacity: 0; transition: opacity 0.2s;">
            <img src="${item.image}" width="160" style="object-fit: cover; aspect-ratio: 1/1" />
          </div>
          <img src="${item.image}" width="160" style="object-fit: cover; aspect-ratio: 1/1" />
        </div>
      </a>
    </td>
    <td class="project-content-col" style="padding: 16px; width: 75%; vertical-align: middle">
      <a href="${item.links && item.links.length > 0 ? item.links[0].url : '#'}" ${item.links && item.links.length > 0 ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="papertitle">${item.title}</span>
      </a>
      <br />
      ${item.role ? `<strong>${item.companyUrl ? `<a href="${item.companyUrl}" target="_blank" rel="noopener noreferrer">${item.role}</a>` : item.role}</strong><br />` : ''}
      <em>${item.event || item.location}</em>, ${item.date}
      <br />
      ${renderLinks(item.links)}
      <p>${item.description}</p>
    </td>
  </tr>
  `;
}

// Pagination logic
const ITEMS_PER_PAGE = 3;

function renderListWithLoadMore(containerId, dataList, renderFunc) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!dataList || dataList.length === 0) {
    const uiData = i18nData[currentLang].ui;
    container.innerHTML = `<tr><td style="padding:16px;">${uiData.noData}</td></tr>`;
    return;
  }

  let currentShown = 0;
  container.innerHTML = '';

  function showMoreItems() {
    const nextLimit = Math.min(currentShown + ITEMS_PER_PAGE, dataList.length);
    const itemsToAdd = dataList.slice(currentShown, nextLimit);

    const htmlString = itemsToAdd.map(renderFunc).join('');

    const loadMoreBtn = document.getElementById(`load-more-${containerId}`);
    if (loadMoreBtn) {
      loadMoreBtn.remove();
    }

    container.insertAdjacentHTML('beforeend', htmlString);
    currentShown = nextLimit;

    if (currentShown < dataList.length) {
      const uiData = i18nData[currentLang].ui;
      const btnRow = `
        <tr id="load-more-${containerId}">
          <td colspan="2" style="text-align: center; padding: 20px;">
            <button onclick="document.getElementById('${containerId}').showMore()" 
                    style="padding: 10px 20px; background-color: #f0f0f0; border: 1px solid #ddd; 
                           border-radius: 5px; cursor: pointer; font-family: 'Lato', sans-serif;">
              ${uiData.loadMore}
            </button>
          </td>
        </tr>
      `;
      container.insertAdjacentHTML('beforeend', btnRow);
    }
  }

  container.showMore = showMoreItems;
  showMoreItems();
}

// Main rendering function that gets called when language changes
function renderPortfolio(lang) {
  const data = i18nData[lang];
  const ui = data.ui;

  // Set the selector to the right value
  document.getElementById('langSwitcher').value = lang;

  // Update Headers
  const elExp = document.getElementById('hdr-experiences');
  if (elExp) elExp.textContent = ui.experiences;
  const elPub = document.getElementById('hdr-publications');
  if (elPub) elPub.textContent = ui.publications;
  const elProj = document.getElementById('hdr-projects');
  if (elProj) elProj.textContent = ui.projects;
  const elAch = document.getElementById('hdr-achievements');
  if (elAch) elAch.textContent = ui.achievements;
  const elFoot = document.getElementById('txt-footer');
  if (elFoot) elFoot.innerHTML = ui.footer;

  // Populate Profile
  document.getElementById('profile-name').textContent = data.profile.name;

  const bioHtml = `Hi! I'm a ${data.profile.title} at <a href="${data.profile.institutionUrl}" target="_blank" rel="noopener noreferrer">${data.profile.institution}</a> and currently working as a ${data.profile.currentRole} at <a href="${data.profile.currentCompanyUrl}" target="_blank" rel="noopener noreferrer">${data.profile.currentCompany}</a>.<br><br>${data.profile.bio}`;
  document.getElementById('profile-bio').innerHTML = bioHtml;

  document.getElementById('profile-email').href = `mailto:${data.profile.email}`;
  
  const linksToSet = [
    { id: 'profile-cv', url: data.profile.cvLink },
    { id: 'profile-bio-link', url: data.profile.bioLink },
    { id: 'profile-linkedin', url: data.profile.linkedin },
    { id: 'profile-github', url: data.profile.github },
    { id: 'profile-portfolio', url: data.profile.portfolioLink }
  ];
  
  linksToSet.forEach(link => {
    const el = document.getElementById(link.id);
    if (el) {
      el.href = link.url || '#';
      if (link.url && link.url !== '#') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      } else {
        el.removeAttribute('target');
        el.removeAttribute('rel');
      }
    }
  });
  document.getElementById('profile-image').src = data.profile.image;

  // Populate Sections
  renderListWithLoadMore('experiences-list', data.experiences, renderItem);

  // Load Publications from BibTeX
  if (document.getElementById('publications-list')) {
    loadBibtex('data/publications.bib').then((publications) => {
      if (publications && publications.length > 0) {
        // Change description text based on language
        publications.forEach((pub) => {
          if (pub.description === 'Baca selengkapnya melalui tautan yang tersedia.' || pub.description === 'Read more via the provided links.') {
            pub.description = ui.bibtexFallback;
          }
        });
        renderListWithLoadMore('publications-list', publications, renderItem);
      }
    });
  }

  renderListWithLoadMore('projects-list', data.projects, renderItem);
  renderListWithLoadMore('achievements-list', data.achievements, renderItem);
}

// Function called by the dropdown
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portfolio_lang', lang);
  renderPortfolio(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio(currentLang);
});
