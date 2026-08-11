const assets = [
  { id: 1, title: 'تحدي الوحوش', category: 'قناة', type: 'قنوات عربية', views: '85M', description: 'قناة مسابقات وألغاز ثقافية تفاعلية.', tags: ['مسابقات', 'ثقافة', 'تحدي'] },
  { id: 2, title: 'هل تعلم؟ المعرفة الشاملة', category: 'قناة', type: 'قنوات عربية', views: '42M', description: 'قناة تعليمية وثائقية تناقش حقائق ممتعة ومثيرة.', tags: ['تعليم', 'حقائق', 'وثائقي'] },
  { id: 3, title: 'Monsters Challenge Global', category: 'قناة', type: 'قنوات أجنبية', views: '12M', description: 'نسخة عالمية من تجربة التحديات والاختبارات.', tags: ['إنجليزية', 'مسابقات', 'عالمي'] },
  { id: 4, title: 'تطبيق المصحف الشريف الإلكتروني', category: 'تطبيق', type: 'تطبيقات عربية', views: '250K', description: 'تطبيق قرآني شامل مع قراءات وتفسير وختمة.', tags: ['إسلامي', 'قرآن', 'تطبيق'] },
  { id: 5, title: 'Football Quiz', category: 'تطبيق', type: 'تطبيقات عربية', views: '180K', description: 'لعبة ذكية لتخمين لاعبين وأندية من خلال الصور.', tags: ['كرة قدم', 'ألعاب', 'تطبيق'] },
  { id: 6, title: 'ALS Media Converter Online', category: 'موقع', type: 'مواقع عربية', views: '350K', description: 'منصة مجانية لتحويل الصور والفيديوهات والملفات.', tags: ['أدوات', 'تحويل', 'موقع'] },
  { id: 7, title: 'ALS Trivia Portal', category: 'موقع', type: 'مواقع عربية', views: '190K', description: 'بوابة لألعاب الذكاء والمسابقات المباشرة.', tags: ['ألغاز', 'اختبارات', 'موقع'] },
  { id: 8, title: 'Tech Insights Global', category: 'قناة', type: 'قنوات أجنبية', views: '8M', description: 'قناة تقنية باللغة الإنجليزية تقدم مراجعات شاملة.', tags: ['تقنية', 'مراجعات', 'إنجليزية'] }
];

function renderPortfolio(items = assets) {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  container.innerHTML = items.map(asset => `
    <article class="asset-card">
      <span class="asset-badge">${asset.type}</span>
      <h3>${asset.title}</h3>
      <p>${asset.description}</p>
      <div class="tag-list">
        ${asset.tags.map(tag => `<span>${tag}</span>`).join('')}
      </div>
      <div class="asset-meta">المشاهدات: ${asset.views}</div>
    </article>
  `).join('');
}

function filterPortfolio() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const sort = document.getElementById('sortSelect')?.value || 'name';

  let filtered = assets.filter(asset => {
    const haystack = `${asset.title} ${asset.description} ${asset.type}`.toLowerCase();
    return haystack.includes(search);
  });

  if (sort === 'views') {
    filtered = filtered.sort((a, b) => Number(b.views.replace(/[^0-9]/g, '')) - Number(a.views.replace(/[^0-9]/g, '')));
  } else if (sort === 'latest') {
    filtered = filtered.reverse();
  } else {
    filtered = filtered.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
  }

  renderPortfolio(filtered);
}

if (document.getElementById('portfolioGrid')) {
  renderPortfolio();
  document.getElementById('searchInput')?.addEventListener('input', filterPortfolio);
  document.getElementById('sortSelect')?.addEventListener('change', filterPortfolio);
}
