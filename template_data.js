const portfolioData = {
  profile: {
    name: "Moh Angga Yunus",
    title: "Computer Science Student",
    institution: "UPN \"Veteran\" Jawa Timur",
    institutionUrl: "https://www.upnjatim.ac.id/",
    currentRole: "Backend Developer Intern",
    currentCompany: "CV FlyHigh Sinergi Indonesia",
    bio: "Computer science student with hands-on experience in software development, autonomous systems, and applied research. Has led student research teams, built internal systems, and contributed to research projects in collaboration with national research institutions. Interested in working on practical systems that solve real problems through iteration and teamwork.",
    email: "anggayunus139@gmail.com",
    cvLink: "data/CV_Anda.pdf",
    bioLink: "data/Bio_Anda.txt",
    linkedin: "https://www.linkedin.com/in/moh-angga",
    github: "https://github.com/anggamys",
    image: "images/IMG_5714.JPG"
  },
  
  experiences: [
    {
      id: "exp1",
      title: "Backend Developer Intern",
      role: "CV FlyHigh Sinergi Indonesia",
      location: "Surabaya, Indonesia",
      date: "Mar 2026 - Present",
      description: "Developed backend services using modular architecture. Integrated third-party payment gateways and implemented automated API testing and load testing using k6.",
      image: "images/project_placeholder.png",
      links: []
    },
    {
      id: "exp2",
      title: "Research Intern (NLP)",
      role: "Badan Riset dan Inovasi Nasional (BRIN)",
      location: "Jakarta, Indonesia",
      date: "Jan - May 2026",
      description: "Developed and evaluated natural language processing models for language data analysis. Contributed to scientific publication preparation and technical reporting.",
      image: "images/project_placeholder.png",
      links: []
    },
    {
      id: "exp3",
      title: "Research Team Lead (ASV)",
      role: "Komunitas Robotika dan Sistem Cerdas",
      location: "Surabaya, Indonesia",
      date: "Jan - Dec 2025",
      description: "Led a cross-disciplinary team of 11 students to design and integrate unmanned vessel prototypes. Developed autonomous navigation systems.",
      image: "images/project_placeholder.png",
      links: [
        { name: "github", url: "https://github.com/anggamys" }
      ]
    },
    {
      id: "exp4",
      title: "Website Developer Intern",
      role: "Kementerian Agama Kota Surabaya",
      location: "Surabaya, Indonesia",
      date: "Jul - Dec 2025",
      description: "Developed and maintained an internal web-based system for daily operations, collaborating with staff to align system functionality with workflow needs.",
      image: "images/project_placeholder.png",
      links: []
    }
  ],
  
  projects: [
    {
      id: "proj1",
      title: "PEMIRA Online Voting System",
      role: "Head of Website Division",
      event: "Himpunan Mahasiswa Informatika",
      date: "2024",
      description: "Led a team of 3 to develop and deploy a real-time online voting system serving 200+ voters with zero downtime.",
      image: "images/project_placeholder.png",
      links: [
        { name: "github", url: "https://github.com/anggamys" }
      ]
    },
    {
      id: "proj2",
      title: "PIBITI 2025 LMS",
      role: "Website Developer Staff",
      event: "Himpunan Mahasiswa Informatika",
      date: "2025",
      description: "Refactored backend features and resolved issues for the Learning Management System, improving system stability for 75 participants.",
      image: "images/project_placeholder.png",
      links: [
        { name: "github", url: "https://github.com/anggamys" }
      ]
    }
  ],

  achievements: [
    {
      id: "ach1",
      title: "2nd Place, Prototype Development - Autonomous Surface Vessel",
      event: "Kontes Kapal Indonesia (KKI)",
      date: "Oct 2024",
      description: "Achieved 2nd place out of 20+ university teams. Collaborated with an interdisciplinary team to design, build, and field-test an ASV prototype.",
      image: "images/project_placeholder.png",
      links: []
    },
    {
      id: "ach2",
      title: "2nd Place, Web Programming Competition",
      event: "Universitas Muhammadiyah Sidoarjo",
      date: "Jan 2024",
      description: "Won 2nd place out of approximately 25 teams. Developed responsive web interfaces focusing on usability and visual consistency.",
      image: "images/project_placeholder.png",
      links: []
    }
  ]
};

function renderLinks(links) {
  if (!links || links.length === 0) return '';
  return links.map(link => `<a href="${link.url}">${link.name}</a>`).join(' / ') + '<br>';
}

function renderItem(item) {
  return `
  <tr onmouseout="${item.id}_stop()" onmouseover="${item.id}_start()">
    <td style="padding: 16px; width: 25%; vertical-align: middle">
      <div class="one">
        <div class="two" id="${item.id}_image">
          <img src="${item.image}" width="160" style="object-fit: cover; aspect-ratio: 1/1" />
        </div>
        <img src="${item.image}" width="160" style="object-fit: cover; aspect-ratio: 1/1" />
      </div>
      <script type="text/javascript">
        function ${item.id}_start() {
          document.getElementById('${item.id}_image').style.opacity = '1';
        }
        function ${item.id}_stop() {
          document.getElementById('${item.id}_image').style.opacity = '0';
        }
        ${item.id}_stop();
      </script>
    </td>
    <td style="padding: 16px; width: 75%; vertical-align: middle">
      <a href="${item.links && item.links.length > 0 ? item.links[0].url : '#'}">
        <span class="papertitle">${item.title}</span>
      </a>
      <br />
      <strong>${item.role}</strong>
      <br />
      <em>${item.event || item.location}</em>, ${item.date}
      <br />
      ${renderLinks(item.links)}
      <p>${item.description}</p>
    </td>
  </tr>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  // Populate Profile
  document.getElementById('profile-name').textContent = portfolioData.profile.name;
  
  const bioHtml = `Hi! I'm a ${portfolioData.profile.title} at <a href="${portfolioData.profile.institutionUrl}">${portfolioData.profile.institution}</a> and currently working as a ${portfolioData.profile.currentRole} at ${portfolioData.profile.currentCompany}.<br><br>${portfolioData.profile.bio}`;
  document.getElementById('profile-bio').innerHTML = bioHtml;
  
  document.getElementById('profile-email').href = `mailto:${portfolioData.profile.email}`;
  document.getElementById('profile-cv').href = portfolioData.profile.cvLink;
  document.getElementById('profile-bio-link').href = portfolioData.profile.bioLink;
  document.getElementById('profile-linkedin').href = portfolioData.profile.linkedin;
  document.getElementById('profile-github').href = portfolioData.profile.github;
  document.getElementById('profile-image').src = portfolioData.profile.image;

  // Populate Sections
  const experiencesHtml = portfolioData.experiences.map(renderItem).join('');
  document.getElementById('experiences-list').innerHTML = experiencesHtml;
  
  const projectsHtml = portfolioData.projects.map(renderItem).join('');
  document.getElementById('projects-list').innerHTML = projectsHtml;

  const achievementsHtml = portfolioData.achievements.map(renderItem).join('');
  document.getElementById('achievements-list').innerHTML = achievementsHtml;
});
