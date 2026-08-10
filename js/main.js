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

// ---------- hero convergence animation ----------
// A field of particles drifts and periodically converges toward a shifting
// target point, then disperses again — a nod to particle-swarm / genetic
// optimization converging on a solution.
(function () {
  var canvas = document.getElementById('converge-canvas');
  if (!canvas) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var W, H, DPR;
  var particles = [];
  var N = 46;
  var target = { x: 0.5, y: 0.5 };
  var phase = 0; // 0..1, 0 = scattered, 1 = converged
  var direction = 1;
  var lastTargetShift = 0;

  var inkSignal = getComputedStyle(document.documentElement).getPropertyValue('--signal').trim() || '#4F8F72';
  var inkIndigo = getComputedStyle(document.documentElement).getPropertyValue('--indigo').trim() || '#5D6FA6';

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seed() {
    particles = [];
    for (var i = 0; i < N; i++) {
      particles.push({
        sx: Math.random(), sy: Math.random(), // scattered position (0..1)
        r: 1.6 + Math.random() * 2.1,
        drift: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.25,
        color: Math.random() > 0.78 ? inkIndigo : inkSignal,
        wob: 6 + Math.random() * 10
      });
    }
  }

  function pickTarget() {
    target.x = 0.28 + Math.random() * 0.44;
    target.y = 0.3 + Math.random() * 0.4;
  }

  function step(ts) {
    if (!W) resize();
    ctx.clearRect(0, 0, W, H);

    if (reduceMotion) {
      // static settled composition, no animation loop
      phase = 0.72;
    } else {
      phase += direction * 0.0022;
      if (phase > 1) { phase = 1; direction = -1; }
      if (phase < 0) { phase = 0; direction = 1; pickTarget(); }
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var t = ts * 0.001 * p.speed + p.drift;
      var wobX = Math.cos(t) * (p.wob / W);
      var wobY = Math.sin(t * 1.3) * (p.wob / H);

      var ease = phase * phase * (3 - 2 * phase); // smoothstep
      var px = (p.sx + wobX) * (1 - ease) + target.x * ease;
      var py = (p.sy + wobY) * (1 - ease) + target.y * ease;

      var x = px * W, y = py * H;
      var alpha = 0.35 + ease * 0.55;

      ctx.beginPath();
      ctx.fillStyle = hexToRgba(p.color, alpha);
      ctx.arc(x, y, p.r + ease * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // faint connecting line toward target once mostly converged
      if (ease > 0.55) {
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(p.color, (ease - 0.55) * 0.35);
        ctx.lineWidth = 0.6;
        ctx.moveTo(x, y);
        ctx.lineTo(target.x * W, target.y * H);
        ctx.stroke();
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  function hexToRgba(hex, a) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  window.addEventListener('resize', resize);
  pickTarget();
  seed();
  resize();
  requestAnimationFrame(step);
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
