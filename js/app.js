/**
 * MediCare Pulse - Main Router & Navigation Controller
 */

let activeTab = 'default';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // 1. Theme initialization
  initTheme();

  // 2. Event listeners setup
  setupRoleSwitchers();
  setupMobileDrawer();
  setupNotifications();
  setupThemeToggle();

  // 3. State listener to trigger view re-renders
  appStore.subscribe((state) => {
    updateHeaderUserDisplay();
    renderSidebarNav();
    renderActiveView();
  });

  // Initial render
  updateHeaderUserDisplay();
  renderSidebarNav();

  // Default initial view based on role
  const defaultTabs = { admin: 'users', doctor: 'schedule', patient: 'book' };
  activeTab = defaultTabs[appStore.state.currentRole] || 'users';
  renderActiveView();
}

// --- Role Switching Handlers ---
function setupRoleSwitchers() {
  const roleGroup = document.getElementById('roleSelectorGroup');
  const mobileRoleSelect = document.getElementById('mobileRoleSelect');

  if (roleGroup) {
    roleGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.role-btn');
      if (!btn) return;
      const role = btn.getAttribute('data-role');
      switchRole(role);
    });
  }

  if (mobileRoleSelect) {
    mobileRoleSelect.addEventListener('change', (e) => {
      switchRole(e.target.value);
    });
  }
}

function switchRole(role) {
  appStore.setRole(role);
  
  const defaultTabs = { admin: 'users', doctor: 'schedule', patient: 'book' };
  activeTab = defaultTabs[role];

  showToast(`Switched view to ${role.toUpperCase()} Dashboard`, 'info');
}

// --- Dynamic Header Display Update ---
function updateHeaderUserDisplay() {
  const currentRole = appStore.state.currentRole;
  const currentUser = appStore.state.currentUser;

  // Role button styles
  document.querySelectorAll('.role-btn').forEach(btn => {
    const btnRole = btn.getAttribute('data-role');
    if (btnRole === currentRole) {
      btn.className = 'role-btn role-btn-active text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm';
    } else {
      btn.className = 'role-btn role-btn-inactive text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5';
    }
  });

  const mobileSelect = document.getElementById('mobileRoleSelect');
  if (mobileSelect) mobileSelect.value = currentRole;

  // Avatar & name
  const avatar = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userName');
  const roleTitleEl = document.getElementById('userRoleTitle');

  if (currentUser) {
    const initials = currentUser.name.split(' ').map(n=>n[0]).slice(0,2).join('');
    if (avatar) avatar.innerText = initials;
    if (nameEl) nameEl.innerText = currentUser.name;
    if (roleTitleEl) roleTitleEl.innerText = currentUser.role === 'admin' ? 'System Administrator' : currentUser.role === 'doctor' ? (currentUser.department || 'Doctor') : 'Registered Patient';
  }

  // Notifications Badge
  const unreadCount = appStore.state.notifications.filter(n => !n.read).length;
  const notifBadge = document.getElementById('notifBadge');
  if (notifBadge) {
    if (unreadCount > 0) {
      notifBadge.classList.remove('hidden');
    } else {
      notifBadge.classList.add('hidden');
    }
  }
}

// --- Dynamic Sidebar Navigation Render ---
function renderSidebarNav() {
  const role = appStore.state.currentRole;
  const navContainer = document.getElementById('sidebarNav');
  const roleNameEl = document.getElementById('sidebarRoleName');
  const roleIconEl = document.getElementById('sidebarRoleIcon');

  if (!navContainer) return;

  let links = [];
  if (role === 'admin') {
    if (roleNameEl) roleNameEl.innerText = 'Admin Dashboard';
    if (roleIconEl) roleIconEl.innerHTML = `<i data-lucide="shield" class="w-5 h-5"></i>`;
    links = [
      { id: 'users', label: 'User Management', icon: 'users' },
      { id: 'appointments', label: 'Appointment Overseer', icon: 'calendar' },
      { id: 'settings', label: 'System Settings', icon: 'sliders' },
      { id: 'analytics', label: 'Performance Analytics', icon: 'bar-chart-3' }
    ];
  } else if (role === 'doctor') {
    if (roleNameEl) roleNameEl.innerText = 'Doctor Dashboard';
    if (roleIconEl) roleIconEl.innerHTML = `<i data-lucide="stethoscope" class="w-5 h-5"></i>`;
    links = [
      { id: 'schedule', label: 'Schedule Management', icon: 'clock' },
      { id: 'records', label: 'Patient Medical Charts', icon: 'folder-heart' },
      { id: 'appointments', label: 'Appointment Overview', icon: 'clipboard-list' },
      { id: 'feedback', label: 'Patient Feedback', icon: 'star' }
    ];
  } else if (role === 'patient') {
    if (roleNameEl) roleNameEl.innerText = 'Patient Portal';
    if (roleIconEl) roleIconEl.innerHTML = `<i data-lucide="user" class="w-5 h-5"></i>`;
    links = [
      { id: 'book', label: 'Book Appointment', icon: 'calendar-plus' },
      { id: 'history', label: 'Appointment History', icon: 'calendar' },
      { id: 'records', label: 'Medical Records', icon: 'activity' },
      { id: 'profile', label: 'Profile Management', icon: 'user-check' }
    ];
  }

  navContainer.innerHTML = links.map(link => {
    const isActive = activeTab === link.id;
    return `
      <button onclick="navigateToTab('${link.id}')" class="w-full nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}">
        <i data-lucide="${link.icon}" class="w-4 h-4"></i>
        <span>${link.label}</span>
      </button>
    `;
  }).join('');

  lucide.createIcons();
}

window.navigateToTab = function(tabId) {
  activeTab = tabId;
  renderSidebarNav();
  renderActiveView();

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
};

// --- Render Active View based on Role & Tab ---
function renderActiveView() {
  const role = appStore.state.currentRole;

  if (role === 'admin') {
    renderAdminDashboard(activeTab);
  } else if (role === 'doctor') {
    renderDoctorDashboard(activeTab);
  } else if (role === 'patient') {
    renderPatientDashboard(activeTab);
  }
}

// --- Mobile Sidebar Controls ---
function setupMobileDrawer() {
  const btn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (btn && sidebar && overlay) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    });
  }
}

// --- Notifications Popover ---
function setupNotifications() {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  const clearBtn = document.getElementById('clearNotifsBtn');

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('hidden');
      renderNotifList();
    });

    document.addEventListener('click', (e) => {
      if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.add('hidden');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      appStore.markNotificationsRead();
      renderNotifList();
      showToast('Notifications marked as read', 'info');
    });
  }
}

function renderNotifList() {
  const listEl = document.getElementById('notifList');
  if (!listEl) return;

  const notifs = appStore.state.notifications;
  if (notifs.length === 0) {
    listEl.innerHTML = `<p class="text-xs text-slate-400 p-4 text-center">No notifications.</p>`;
    return;
  }

  listEl.innerHTML = notifs.map(n => `
    <div class="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex items-start space-x-2.5 ${!n.read ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''}">
      <div class="w-2 h-2 rounded-full mt-1.5 ${!n.read ? 'bg-teal-500' : 'bg-slate-300'}"></div>
      <div class="flex-1">
        <div class="text-xs font-bold text-slate-800 dark:text-slate-100">${n.title}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">${n.message}</div>
        <div class="text-[10px] text-slate-400 mt-1 font-medium">${n.time}</div>
      </div>
    </div>
  `).join('');
}

// --- Theme Toggle Controls ---
function setupThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('medicare_theme', isDark ? 'dark' : 'light');
    });
  }
}

function initTheme() {
  const saved = localStorage.getItem('medicare_theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
