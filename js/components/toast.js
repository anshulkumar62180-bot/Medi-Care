/**
 * MediCare Pulse - Toast Notification Component
 */

window.showToast = function(message, type = 'success', title = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toastId = 'toast_' + Date.now();
  
  let bgBorder, iconName, iconColor, defaultTitle;

  switch (type) {
    case 'error':
      bgBorder = 'bg-rose-50 border-rose-200 dark:bg-rose-950/80 dark:border-rose-800 text-rose-900 dark:text-rose-100';
      iconName = 'alert-circle';
      iconColor = 'text-rose-600 dark:text-rose-400';
      defaultTitle = title || 'Action Failed';
      break;
    case 'warning':
      bgBorder = 'bg-amber-50 border-amber-200 dark:bg-amber-950/80 dark:border-amber-800 text-amber-900 dark:text-amber-100';
      iconName = 'alert-triangle';
      iconColor = 'text-amber-600 dark:text-amber-400';
      defaultTitle = title || 'Warning';
      break;
    case 'info':
      bgBorder = 'bg-cyan-50 border-cyan-200 dark:bg-cyan-950/80 dark:border-cyan-800 text-cyan-900 dark:text-cyan-100';
      iconName = 'info';
      iconColor = 'text-cyan-600 dark:text-cyan-400';
      defaultTitle = title || 'Information';
      break;
    case 'success':
    default:
      bgBorder = 'bg-teal-50 border-teal-200 dark:bg-teal-950/80 dark:border-teal-800 text-teal-900 dark:text-teal-100';
      iconName = 'check-circle-2';
      iconColor = 'text-teal-600 dark:text-teal-400';
      defaultTitle = title || 'Success';
      break;
  }

  const toastEl = document.createElement('div');
  toastEl.id = toastId;
  toastEl.className = `toast-animate pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start space-x-3 transition-all duration-200 ${bgBorder}`;
  
  toastEl.innerHTML = `
    <div class="flex-shrink-0 mt-0.5">
      <i data-lucide="${iconName}" class="w-5 h-5 ${iconColor}"></i>
    </div>
    <div class="flex-1 pr-2">
      <h5 class="text-sm font-bold leading-snug">${defaultTitle}</h5>
      <p class="text-xs mt-0.5 opacity-90 leading-relaxed">${message}</p>
    </div>
    <button onclick="dismissToast('${toastId}')" class="flex-shrink-0 opacity-60 hover:opacity-100 p-1 rounded-lg">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toastEl);
  lucide.createIcons();

  // Auto dismiss after 3.5s
  setTimeout(() => {
    dismissToast(toastId);
  }, 3500);
};

window.dismissToast = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(100%) scale(0.9)';
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 200);
  }
};
