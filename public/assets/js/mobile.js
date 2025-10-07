// Menu Hamburguer Lateral

document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.querySelector('header button.md\\:hidden');
  const nav = document.querySelector('header nav');
  const overlay = document.createElement('div');
  
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
  document.body.appendChild(overlay);

  menuBtn.addEventListener('click', function () {
    nav.classList.toggle('translate-x-full');
    nav.classList.toggle('translate-x-0');
    
    overlay.classList.toggle('hidden');
    
    document.body.classList.toggle('overflow-hidden');
  });

  overlay.addEventListener('click', function () {
    nav.classList.add('translate-x-full');
    nav.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      nav.classList.remove('translate-x-full', 'translate-x-0');
      overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  });
});