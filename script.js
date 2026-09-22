(function () {
  var status = document.getElementById('status');
  var message = document.getElementById('message');

  function scheduleReadyPulse(dot) {
    var delay = 1000 + Math.random() * 2000;
    window.setTimeout(function () {
      if (!dot.isConnected || !dot.classList.contains('status-dot--ready')) return;
      dot.classList.remove('status-dot--pulse');
      void dot.offsetWidth;
      dot.classList.add('status-dot--pulse');
      window.setTimeout(function () {
        dot.classList.remove('status-dot--pulse');
        scheduleReadyPulse(dot);
      }, 500);
    }, delay);
  }

  function setStatus(text, state) {
    status.textContent = '';
    var dot = document.createElement('span');
    dot.className = 'status-dot status-dot--' + state;
    dot.setAttribute('aria-hidden', 'true');
    status.appendChild(dot);
    status.appendChild(document.createTextNode(text));
    if (state === 'ready') scheduleReadyPulse(dot);
  }

  if (!navigator.gpu) {
    setStatus('WebGPU unavailable', 'error');
    message.textContent = 'Open this demo in a current browser with WebGPU enabled.';
    return;
  }

  setStatus('Loading viewer…', 'loading');
  var script = document.createElement('script');
  script.src = 'bundle-3bf2b71d9b27.js';
  script.onload = function () {
    setStatus('Viewer ready', 'ready');
    message.remove();
  };
  script.onerror = function () {
    setStatus('Viewer failed to load', 'error');
    message.textContent = 'The viewer could not be loaded. Check the browser console for details.';
  };
  document.body.appendChild(script);
}());
