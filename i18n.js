(() => {
  const browserLanguage = (navigator.language || '').toLowerCase();
  const storedLanguage = window.localStorage?.getItem('obyom-language');
  const language = storedLanguage === 'ru' || storedLanguage === 'en'
    ? storedLanguage
    : (browserLanguage.startsWith('ru') ? 'ru' : 'en');

  const translations = {
    en: {
      main: {
        navDemo: 'Demo', navGuide: 'For developers', navSource: 'Source code ↗',
        manifestoLabel: 'OBYOM integration statement', manifestoIntro: 'Add OBYOM in your', manifestoItems: ['Site', 'Project', 'Solution'],
        eyebrow: 'Browser-based 3D previews', heroTitle: 'Show your 3D work to clients directly in the browser.', heroCopy: 'Create interactive previews for your portfolio or send a specific model for client approval — without asking anyone to install CAD software.', tryViewer: 'Try the demo ↓', pilotCta: 'Discuss a pilot ↘', marketNote: 'For Russian teams, OBYOM is a local foundation for replacing foreign 3D viewer components in client-facing workflows.', useCasesEyebrow: 'Use cases', useCasesTitle: 'One viewer. Two ways to work with a client.', useCases: ['Show your work', 'Build an interactive portfolio or project page so clients can explore the shape instead of looking at screenshots.', 'Get a model approved', 'Send a private preview of a specific version, scale, and model so the approval is tied to exactly what goes into work.'], pilotEyebrow: 'First pilot', pilotTitle: 'Turn one real model into a client-ready preview.', pilotSteps: ['Choose a model', 'Start with one of your real projects or portfolio pieces.', 'Share the preview', 'Give a client an interactive page instead of a screenshot or CAD file.', 'Confirm the version', 'Keep the model, scale, and approval status tied to the same revision.'],
        liveDemo: 'Live demo', checking: 'Checking WebGPU support…', canvasLabel: 'Interactive 3D model of the OBYOM logo', loading: 'Loading viewer…', hint: '↔ Drag to rotate the model. Touch gestures are supported.',
        features: ['Runs in the browser', 'No installation or CAD application required.', 'Powered by WebGPU', 'Modern GPU rendering for interactive previews.', 'Simple to embed', 'A small viewer core built for the web.'],
        compatibility: 'Compatibility', supported: 'Supported browsers', supportCopy: 'Use a current browser with WebGPU enabled. Support depends on the browser, operating system, and GPU driver.', browserPlatforms: ['Desktop & mobile', 'macOS & iOS', 'Desktop', 'Current releases'], minimum: 'MINIMUM VERSIONS', versions: ['WebGPU enabled; Linux depends on hardware and drivers', 'WebGPU enabled', 'macOS 26+; WebGPU availability varies by platform', 'WebGPU enabled; default availability depends on the platform'], disclaimer: 'WebGPU support also depends on the operating system, GPU, drivers, and browser settings. Check Can I Use WebGPU for current details.',
        footer: 'OBYOM WebGPU viewer', model: 'Model: ', unavailable: 'WebGPU unavailable', unavailableMessage: 'Open this demo in a current browser with WebGPU enabled.', loadingPackage: 'Loading OBYOM from GitFlic package', ready: 'Viewer ready', failed: 'Viewer failed to load', failedMessage: 'The viewer could not be loaded. Check the browser console for details.'
      },
      guide: {
        navDemo: 'Demo', navGuide: 'For developers', navSource: 'Source code ↗', eyebrow: 'Documentation / 01', title: 'Get OBYOM running in your project.', lead: 'Install the package, mount a canvas, and load your first 3D model with a small async setup.', onPage: 'ON THIS PAGE', links: ['Requirements', 'Install', 'Initialize the viewer', 'Deploy'],
        steps: ['01 / Requirements', '02 / Install', '03 / Initialize', '04 / Deploy'], headings: ['Start with a WebGPU-ready browser.', 'Add the package to your application.', 'Mount a viewer on a canvas.', 'Serve the built application over HTTP(S).'],
        paragraphs: ['OBYOM runs in the browser and needs WebGPU access. Use a current Chrome, Edge, Safari, or Firefox release with WebGPU enabled and a supported GPU driver.', 'From your project directory, install the public npm package:', 'OBYOM ships as an ESM package with generated TypeScript declarations and its shader code embedded in the production bundle.', 'Add a canvas to your page. Give it dimensions through CSS or its HTML attributes:', 'Then create the viewer, start WebGPU, and load an STL asset:', 'Build your application with your usual bundler, then deploy the generated assets to your hosting provider. For a local smoke test, run a static server from the project root:', 'Open http://localhost:8080 in a WebGPU-capable browser. In production, use HTTPS and make sure the bundled JavaScript, model files, and any static assets are available at their referenced paths.'],
        requirements: ['Node.js 20.9+ and npm 10+ for the project setup', 'A browser with WebGPU support', 'An HTTP(S) origin — do not open the page directly as file://'], calloutTitle: 'Keep the order.', callout: 'Call start() before load(). The model path is resolved by your application, so serve the asset from the same site or a permitted URL.', tryViewer: 'Try the live viewer ↗', footer: 'OBYOM WebGPU viewer', footerSource: 'Source code ↗'
      }
    },
    ru: {
      main: {
        navDemo: 'Демо', navGuide: 'Для разработчиков', navSource: 'Исходный код ↗', manifestoLabel: 'Интеграция OBYOM', manifestoIntro: 'Добавьте OBYOM в свой', manifestoItems: ['Сайт', 'Проект', 'Решение'], eyebrow: '3D-превью в браузере', heroTitle: 'Показывайте клиентам свою 3D-работу прямо в браузере.', heroCopy: 'Создавайте интерактивные страницы портфолио или отправляйте конкретную модель на согласование — без установки CAD-программ.', tryViewer: 'Открыть демо ↓', pilotCta: 'Обсудить пилот ↘', marketNote: 'Для российских команд OBYOM — отечественная основа для замены зарубежных компонентов 3D-просмотра в клиентских сценариях.', useCasesEyebrow: 'Сценарии', useCasesTitle: 'Один просмотрщик. Два способа работать с клиентом.', useCases: ['Показывайте свои работы', 'Создайте интерактивное портфолио или страницу проекта, чтобы клиент изучал форму, а не смотрел на скриншоты.', 'Согласуйте модель', 'Отправьте закрытое превью конкретной версии, масштаба и модели, чтобы согласование относилось именно к передаваемой в работу версии.'], pilotEyebrow: 'Первый пилот', pilotTitle: 'Превратите одну реальную модель в готовое превью для клиента.', pilotSteps: ['Выберите модель', 'Начните с реального проекта или работы для портфолио.', 'Отправьте превью', 'Дайте клиенту интерактивную страницу вместо скриншота или CAD-файла.', 'Зафиксируйте версию', 'Свяжите модель, масштаб и статус согласования с одной редакцией.'], checking: 'Проверяем поддержку WebGPU…', canvasLabel: 'Интерактивная 3D-модель логотипа OBYOM', loading: 'Загрузка просмотрщика…', hint: '↔ Перетаскивайте модель для вращения. Поддерживаются сенсорные жесты.', features: ['Работает в браузере', 'Не требует установки или CAD-приложения.', 'На базе WebGPU', 'Современный GPU-рендеринг для интерактивных превью.', 'Просто встроить', 'Компактное ядро просмотрщика для веба.'], compatibility: 'Совместимость', supported: 'Поддерживаемые браузеры', supportCopy: 'Используйте актуальный браузер с включённым WebGPU. Поддержка зависит от браузера, операционной системы и драйвера GPU.', browserPlatforms: ['Компьютер и мобильные', 'macOS и iOS', 'Компьютер', 'Актуальные версии'], minimum: 'МИНИМАЛЬНЫЕ ВЕРСИИ', versions: ['WebGPU включён; Linux зависит от оборудования и драйверов', 'WebGPU включён', 'macOS 26+; доступность WebGPU зависит от платформы'], disclaimer: 'Поддержка WebGPU также зависит от ОС, GPU, драйверов и настроек браузера. Актуальные данные смотрите на Can I Use WebGPU.', footer: '3D-просмотрщик OBYOM', model: 'Модель: ', unavailable: 'WebGPU недоступен', unavailableMessage: 'Откройте демо в актуальном браузере с включённым WebGPU.', loadingPackage: 'Загрузка OBYOM из пакета GitFlic', ready: 'Просмотрщик готов', failed: 'Не удалось загрузить просмотрщик', failedMessage: 'Просмотрщик не загрузился. Подробности доступны в консоли браузера.'
      },
      guide: {
        navDemo: 'Демо', navGuide: 'Для разработчиков', navSource: 'Исходный код ↗', eyebrow: 'Документация / 01', title: 'Запустите OBYOM в своём проекте.', lead: 'Установите пакет, добавьте canvas и загрузите первую 3D-модель с помощью простой асинхронной настройки.', onPage: 'НА ЭТОЙ СТРАНИЦЕ', links: ['Требования', 'Установка', 'Инициализация просмотрщика', 'Развёртывание'], steps: ['01 / Требования', '02 / Установка', '03 / Инициализация', '04 / Развёртывание'], headings: ['Начните с браузера с поддержкой WebGPU.', 'Добавьте пакет в приложение.', 'Подключите просмотрщик к canvas.', 'Раздавайте собранное приложение по HTTP(S).'], paragraphs: ['OBYOM работает в браузере и требует доступа к WebGPU. Используйте актуальную версию Chrome, Edge, Safari или Firefox с включённым WebGPU и совместимым драйвером GPU.', 'В каталоге проекта установите публичный npm-пакет:', 'OBYOM поставляется как ESM-пакет с декларациями TypeScript и встроенными шейдерами в production-бандле.', 'Добавьте canvas на страницу. Задайте его размеры через CSS или HTML-атрибуты:', 'Затем создайте просмотрщик, запустите WebGPU и загрузите STL-файл:', 'Соберите приложение привычным бандлером и разместите сгенерированные файлы на хостинге. Для локальной проверки запустите статический сервер из корня проекта:', 'Откройте http://localhost:8080 в браузере с поддержкой WebGPU. В production используйте HTTPS и убедитесь, что JavaScript-бандл, модели и остальные ресурсы доступны по указанным путям.'], requirements: ['Node.js 20.9+ и npm 10+ для настройки проекта', 'Браузер с поддержкой WebGPU', 'HTTP(S)-источник — не открывайте страницу напрямую через file://'], calloutTitle: 'Соблюдайте порядок.', callout: 'Сначала вызовите start(), затем load(). Путь к модели определяется приложением, поэтому ресурс должен раздаваться с того же сайта или разрешённого URL.', tryViewer: 'Открыть демо ↗', footer: '3D-просмотрщик OBYOM', footerSource: 'Исходный код ↗'
      }
    }
  };

  const t = translations[language];
  document.documentElement.lang = language;
  const languageToggle = document.querySelector('[data-language-toggle]');
  if (languageToggle) {
    languageToggle.textContent = language === 'ru' ? 'EN' : 'RU';
    languageToggle.setAttribute('aria-label', language === 'ru' ? 'Switch to English' : 'Переключить на русский');
    languageToggle.addEventListener('click', () => {
      window.localStorage?.setItem('obyom-language', language === 'ru' ? 'en' : 'ru');
      window.location.reload();
    });
  }
  const pageTitle = document.body.dataset.page === 'demo'
    ? (language === 'ru' ? 'Демо — OBYOM' : 'Demo — OBYOM')
    : document.body.dataset.page === 'clients'
      ? (language === 'ru' ? 'Для мастерских — OBYOM' : 'For Workshops — OBYOM')
      : document.querySelector('.docs-hero')
        ? (language === 'ru' ? 'Для разработчиков — OBYOM' : 'For developers — OBYOM')
        : (language === 'ru' ? 'OBYOM — WebGPU 3D-просмотрщик' : 'OBYOM — WebGPU 3D viewer');
  document.title = pageTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'ru'
    ? 'OBYOM — лёгкий 3D-просмотрщик WebGPU для моделей в браузере.'
    : 'OBYOM is a lightweight WebGPU 3D viewer for exploring models directly in the browser.');
  window.OBYOM_I18N = { language, t: (key) => key.split('.').reduce((value, part) => value?.[part], t) };

  const set = (selector, value, root = document) => { const node = root.querySelector(selector); if (node) node.textContent = value; };
  const setAll = (selector, values, root = document) => root.querySelectorAll(selector).forEach((node, index) => { if (values[index] !== undefined) node.textContent = values[index]; });
  const source = document.querySelector('main');
  if (!source) return;

  set('title', document.title);
  if (document.querySelector('.manifesto')) {
    const m = t.main; set('[data-nav-demo]', m.navDemo); set('[data-nav-guide]', m.navGuide); set('[data-nav-source]', m.navSource);
    set('.manifesto-intro', m.manifestoIntro); setAll('.manifesto-list li', m.manifestoItems); set('.hero .eyebrow', m.eyebrow); set('#hero-title', m.heroTitle); set('.hero-copy', m.heroCopy); set('.hero .button-primary', m.tryViewer); set('.hero .button-secondary', m.pilotCta); set('.use-cases .eyebrow', m.useCasesEyebrow); set('#use-cases-title', m.useCasesTitle); setAll('.use-case-card h3, .use-case-card p', m.useCases); set('.market-note', language === 'ru' ? m.marketNote : ''); set('.pilot .eyebrow', m.pilotEyebrow); set('#pilot-title', m.pilotTitle); setAll('.pilot-steps strong, .pilot-steps span', m.pilotSteps); set('.pilot .button-primary', m.pilotCta); set('.viewer-heading .eyebrow', m.liveDemo); set('#status', m.checking); set('#message', m.loading); set('.hint', m.hint); setAll('.feature strong, .feature span:last-child', m.features); set('.browser-support .eyebrow', m.compatibility); set('#browser-support-title', m.supported); set('.browser-support-copy', m.supportCopy); setAll('.browser-item span', m.browserPlatforms); set('.browser-versions .feature-index', m.minimum); setAll('.browser-version-list span', m.versions); set('.browser-disclaimer', m.disclaimer); set('footer span:first-child', m.footer); set('footer span:last-child', `${m.model}${document.querySelector('#model-name')?.textContent || ''}`); document.querySelector('#viewer')?.setAttribute('aria-label', m.canvasLabel);
  } else if (document.querySelector('.docs-hero') && !document.body.dataset.page) {
    const g = t.guide; set('[data-nav-demo]', g.navDemo); set('[data-nav-guide]', g.navGuide); set('[data-nav-source]', g.navSource); set('.docs-hero .eyebrow', g.eyebrow); set('#page-title', g.title); set('.docs-lead', g.lead); set('.docs-index .feature-index', g.onPage); setAll('.docs-index a', g.links); setAll('.step-label', g.steps); setAll('.guide h2', g.headings); setAll('.check-list li', g.requirements); setAll('.guide-section p:not(.step-label)', g.paragraphs); set('.callout strong', g.calloutTitle); set('.callout span', g.callout); set('.docs-button', g.tryViewer); set('footer span:first-child', g.footer); set('footer span:last-child a', g.footerSource);
  }
})();
