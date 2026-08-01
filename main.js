function renderLinks(links) {
  if (!links || links.length === 0) return '';
  return links.map((link) => `<a href="${link.url}">${link.name}</a>`).join(' / ') + '<br>';
}

function renderItem(item) {
  return `
  <tr class="item-row" onmouseout="document.getElementById(\'${item.id}_image\').style.opacity = \'0\'" onmouseover="document.getElementById(\'${item.id}_image\').style.opacity = \'1\'">
    <td class="project-image-col" style="padding: 16px; width: 25%; vertical-align: middle">
      <div class="one">
        <div class="two" id="${item.id}_image" style="opacity: 0; transition: opacity 0.2s;">
          <img src="${item.image}" width="160" style="object-fit: cover; aspect-ratio: 1/1" />
        </div>
        <img src="${item.image}" width="160" style="object-fit: cover; aspect-ratio: 1/1" />
      </div>
      
    </td>
    <td class="project-content-col" style="padding: 16px; width: 75%; vertical-align: middle">
      <a href="${item.links && item.links.length > 0 ? item.links[0].url : '#'}">
        <span class="papertitle">${item.title}</span>
      </a>
      <br />
      <strong>${item.companyUrl ? `<a href="${item.companyUrl}" style="color:inherit; text-decoration:none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${item.role}</a>` : item.role}</strong>
      <br />
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
    container.innerHTML = '<tr><td style="padding:16px;">Tidak ada data.</td></tr>';
    return;
  }

  // Keep track of how many items are currently shown
  let currentShown = 0;

  // Clear the container first
  container.innerHTML = '';

  // Function to show more items
  function showMoreItems() {
    const nextLimit = Math.min(currentShown + ITEMS_PER_PAGE, dataList.length);
    const itemsToAdd = dataList.slice(currentShown, nextLimit);

    // Convert items to HTML
    const htmlString = itemsToAdd.map(renderFunc).join('');

    // We can't just innerHTML += because it might destroy event listeners or script tags
    // inside the existing items. Instead, we insert adjacent HTML.

    // If there's a "Load More" button row, we should remove it first,
    // insert the new items, then maybe add it back.
    const loadMoreBtn = document.getElementById(`load-more-${containerId}`);
    if (loadMoreBtn) {
      loadMoreBtn.remove();
    }

    container.insertAdjacentHTML('beforeend', htmlString);
    currentShown = nextLimit;

    // Add "Load More" button if there are still more items to show
    if (currentShown < dataList.length) {
      const btnRow = `
        <tr id="load-more-${containerId}">
          <td colspan="2" style="text-align: center; padding: 20px;">
            <button onclick="document.getElementById('${containerId}').showMore()" 
                    style="padding: 10px 20px; background-color: #f0f0f0; border: 1px solid #ddd; 
                           border-radius: 5px; cursor: pointer; font-family: 'Lato', sans-serif;">
              Tampilkan Lebih Banyak
            </button>
          </td>
        </tr>
      `;
      container.insertAdjacentHTML('beforeend', btnRow);
    }

    // Execute scripts inside the newly added HTML since insertAdjacentHTML
    // doesn't execute script tags
    const scripts = container.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].innerText.includes('_stop()')) {
        eval(scripts[i].innerText);
      }
    }
  }

  // Attach the showMore function to the container so the button can call it
  container.showMore = showMoreItems;

  // Initial load
  showMoreItems();
}

document.addEventListener('DOMContentLoaded', () => {
  // Populate Profile
  document.getElementById('profile-name').textContent = portfolioData.profile.name;

  const bioHtml = `Hi! I'm a ${portfolioData.profile.title} at <a href="${portfolioData.profile.institutionUrl}">${portfolioData.profile.institution}</a> and currently working as a ${portfolioData.profile.currentRole} at <a href="${portfolioData.profile.currentCompanyUrl}">${portfolioData.profile.currentCompany}</a>.<br><br>${portfolioData.profile.bio}`;
  document.getElementById('profile-bio').innerHTML = bioHtml;

  document.getElementById('profile-email').href = `mailto:${portfolioData.profile.email}`;
  document.getElementById('profile-cv').href = portfolioData.profile.cvLink;
  document.getElementById('profile-bio-link').href = portfolioData.profile.bioLink;
  document.getElementById('profile-linkedin').href = portfolioData.profile.linkedin;
  document.getElementById('profile-github').href = portfolioData.profile.github;
  document.getElementById('profile-image').src = portfolioData.profile.image;

  // Populate Sections
  renderListWithLoadMore('experiences-list', portfolioData.experiences, renderItem);

  // Load Publications from BibTeX
  if (document.getElementById('publications-list')) {
    loadBibtex('data/publications.bib').then((publications) => {
      if (publications && publications.length > 0) {
        renderListWithLoadMore('publications-list', publications, renderItem);
      }
    });
  }

  renderListWithLoadMore('projects-list', portfolioData.projects, renderItem);

  renderListWithLoadMore('achievements-list', portfolioData.achievements, renderItem);
});
