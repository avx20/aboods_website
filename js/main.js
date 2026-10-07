// ---------- mobile nav toggle ----------
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); });
  });
})();

// ---------- contact form -> mailto ----------
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('#name').value.trim();
    var email = form.querySelector('#email').value.trim();
    var message = form.querySelector('#message').value.trim();
    var subject = encodeURIComponent('Hello from ' + (name || 'your site'));
    var body = encodeURIComponent(
      (message || '') + '\n\n---\n' + (name || '') + (email ? ' · ' + email : '')
    );
    window.location.href = 'mailto:aboodxst@gmail.com?subject=' + subject + '&body=' + body;
  });
})();

// ---------- smooth scroll for cross-page anchor links ----------
(function () {
  // Check if there is a #hash in the URL when the page loads
  if (window.location.hash) {
    var targetId = window.location.hash;
    var targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Briefly force the browser to the top of the page
      setTimeout(function () {
        window.scrollTo(0, 0);
        
        // Then smoothly glide down to the target project
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 50); // 50ms delay allows the browser to render the page first
    }
  }
})();
