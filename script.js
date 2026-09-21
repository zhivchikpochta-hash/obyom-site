(function () {
  var status = document.getElementById('status');
  var message = document.getElementById('message');

  if (!navigator.gpu) {
    status.textContent = 'WebGPU недоступен';
    message.textContent = 'Откройте сайт в актуальном Chrome или Edge с поддержкой WebGPU.';
    return;
  }

  var script = document.createElement('script');
  script.src = 'bundle.js';
  script.onload = function () {
    status.textContent = 'Просмотрщик запущен';
    message.remove();
  };
  script.onerror = function () {
    status.textContent = 'Ошибка загрузки';
    message.textContent = 'Не найден готовый build библиотеки: bundle.js.';
  };
  document.body.appendChild(script);
}());
