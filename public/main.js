console.log('%c>%c Try ↑ ↑ ↓ ↓ ← → ← → B A', 'color:#7cf2c4;font:bold 15px monospace', 'font:13px monospace');

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Typed tagline
  const typed = document.getElementById('typed');
  const text = typed.textContent;
  typed.textContent = '';
  let i = 0;
  const type = () => {
    typed.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(type, 55);
  };
  setTimeout(type, 300);

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }
  });
  document.querySelectorAll('section, footer').forEach((el) => io.observe(el));
  document.documentElement.classList.add('ready'); // tells the inline failsafe in index.html that reveal is working

  // Background signal: slow sine waves at ~30 fps, paused when the tab is hidden.
  // Easter egg: the Konami code swaps them for a live random-walk "price chart".
  const canvas = document.getElementById('signal');
  const ctx = canvas.getContext('2d');
  let w, h, last = 0, price = null, scroll = 0;
  const resize = () => {
    const dpr = devicePixelRatio || 1;
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
  };
  addEventListener('resize', resize);
  resize();

  const waves = [[0.30, 0.08, 0.0010, 0.004], [0.55, 0.05, 0.0016, 0.007], [0.75, 0.07, 0.0007, 0.003]]; // y, amplitude, speed, frequency
  const walk = (v) => v + Math.random() - 0.44; // slight upward drift
  const plot = (n, xy) => {
    ctx.beginPath();
    for (let k = 0; k < n; k++) ctx[k ? 'lineTo' : 'moveTo'](...xy(k));
    ctx.stroke();
  };

  const konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let pos = 0;
  addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    pos = key === konami[pos] ? pos + 1 : key === konami[0] ? 1 : 0;
    if (pos < konami.length) return;
    pos = 0;
    let v = 0;
    price = price ? null : Array.from({ length: 161 }, () => (v = walk(v)));
  });

  const draw = (t) => {
    requestAnimationFrame(draw);
    if (document.hidden || t - last < 33) return;
    const dt = Math.min(t - last, 100); // capped so a tab coming back doesn't jump
    last = t;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#7cf2c4';
    ctx.lineWidth = devicePixelRatio || 1;
    if (price) {
      // a new point every ~133 ms, scrolled continuously in between
      for (scroll += dt / 133; scroll >= 1; scroll--) price.push(walk(price.at(-1))), price.shift();
      const lo = Math.min(...price), range = Math.max(...price) - lo || 1;
      plot(price.length, (k) => [((k - scroll) / (price.length - 2)) * w, h * (0.75 - 0.5 * (price[k] - lo) / range)]);
      return;
    }
    for (const [y, amp, speed, freq] of waves) {
      plot(Math.ceil(w / 8) + 1, (k) => [k * 8, h * y + Math.sin(k * 8 * freq + t * speed) * h * amp]);
    }
  };
  requestAnimationFrame(draw);
}
