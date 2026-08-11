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

if (document.getElementById('contactForm')) {
  document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const messageBox = document.getElementById('contactMessage');
    const submitButton = form.querySelector('button[type="submit"]');

    messageBox.textContent = 'جاري إرسال الرسالة...';
    messageBox.style.color = '#c7d2fe';
    submitButton.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        messageBox.textContent = data.message || 'تم إرسال الرسالة بنجاح';
        messageBox.style.color = '#10b981';
        form.reset();
      } else {
        messageBox.textContent = data.message || 'تعذر إرسال الرسالة';
        messageBox.style.color = '#ef4444';
      }
    } catch (err) {
      messageBox.textContent = 'تعذر الاتصال بالخادم';
      messageBox.style.color = '#ef4444';
    } finally {
      submitButton.disabled = false;
    }
  });
}
