/**
 * MediCare Pulse - Admin Dashboard Views
 */

window.renderAdminDashboard = function(activeTab = 'users') {
  const container = document.getElementById('mainContent');
  if (!container) return;

  const tabHeader = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <i data-lucide="shield-alert" class="w-7 h-7 text-teal-600 dark:text-teal-400"></i> Admin Operational Control
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage user roles, oversee clinic appointments, configure settings, and monitor analytics.</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2">
        <button onclick="showAddEditUserModal()" class="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition flex items-center gap-1.5">
          <i data-lucide="user-plus" class="w-4 h-4"></i> Add User
        </button>
        <button onclick="showBookAppointmentModal()" class="px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:text-teal-300 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 rounded-xl border border-teal-200 dark:border-teal-800 transition flex items-center gap-1.5">
          <i data-lucide="calendar-plus" class="w-4 h-4"></i> Schedule Appointment
        </button>
      </div>
    </div>
  `;

  let tabContentHtml = '';

  switch (activeTab) {
    case 'users':
      tabContentHtml = renderAdminUserManagement();
      break;
    case 'appointments':
      tabContentHtml = renderAdminAppointmentManagement();
      break;
    case 'settings':
      tabContentHtml = renderAdminSystemSettings();
      break;
    case 'analytics':
      tabContentHtml = renderAdminPerformanceAnalytics();
      break;
    default:
      tabContentHtml = renderAdminUserManagement();
      break;
  }

  container.innerHTML = tabHeader + tabContentHtml;
  lucide.createIcons();

  if (activeTab === 'analytics') {
    initAdminAnalyticsCharts();
  }
};

// 1. User Management Tab
function renderAdminUserManagement() {
  const users = appStore.getUsers();

  return `
    <div class="space-y-4 mt-6">
      <!-- Search & Filters -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="relative w-full md:w-80">
          <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-slate-400"></i>
          <input type="text" id="adminUserSearch" onkeyup="filterAdminUsers()" placeholder="Search users by name or email..." class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100" />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <select id="adminRoleFilter" onchange="filterAdminUsers()" class="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Administrators</option>
          </select>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Total: <strong id="userCountBadge" class="text-slate-900 dark:text-white">${users.length}</strong></span>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="px-6 py-3.5">User</th>
                <th class="px-6 py-3.5">Role</th>
                <th class="px-6 py-3.5">Department / Specialty</th>
                <th class="px-6 py-3.5">Contact Phone</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="adminUserTableBody" class="divide-y divide-slate-100 dark:divide-slate-800">
              ${users.map(u => `
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs border border-teal-500/20">
                        ${u.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <div class="font-bold text-slate-900 dark:text-white text-xs">${u.name}</div>
                        <div class="text-[11px] text-slate-400">${u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 capitalize font-semibold">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                      u.role === 'doctor' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }">
                      ${u.role}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                    ${u.department || u.specialty || 'General'}
                  </td>
                  <td class="px-6 py-4 font-medium">${u.phone || 'N/A'}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                      <span class="w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}"></span> ${u.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right space-x-1">
                    <button onclick='showAddEditUserModal(${JSON.stringify(u)})' class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Edit User">
                      <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <button onclick="handleDeleteUser('${u.id}', '${u.name}')" class="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400" title="Delete User">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.filterAdminUsers = function() {
  const search = document.getElementById('adminUserSearch').value;
  const role = document.getElementById('adminRoleFilter').value;
  const users = appStore.getUsers(role, search);
  
  const tbody = document.getElementById('adminUserTableBody');
  const countBadge = document.getElementById('userCountBadge');
  if (countBadge) countBadge.innerText = users.length;

  if (tbody) {
    tbody.innerHTML = users.map(u => `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
        <td class="px-6 py-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs border border-teal-500/20">
              ${u.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
            </div>
            <div>
              <div class="font-bold text-slate-900 dark:text-white text-xs">${u.name}</div>
              <div class="text-[11px] text-slate-400">${u.email}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 capitalize font-semibold">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
            u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
            u.role === 'doctor' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' :
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          }">
            ${u.role}
          </span>
        </td>
        <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
          ${u.department || u.specialty || 'General'}
        </td>
        <td class="px-6 py-4 font-medium">${u.phone || 'N/A'}</td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
            <span class="w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}"></span> ${u.status}
          </span>
        </td>
        <td class="px-6 py-4 text-right space-x-1">
          <button onclick='showAddEditUserModal(${JSON.stringify(u)})' class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="handleDeleteUser('${u.id}', '${u.name}')" class="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `).join('');
    lucide.createIcons();
  }
};

window.handleDeleteUser = function(id, name) {
  showConfirmDeleteModal(
    `Delete Account: ${name}`,
    `Are you sure you want to remove account <strong>${name}</strong>? This action cannot be undone.`,
    () => {
      if (appStore.deleteUser(id)) {
        showToast(`User account ${name} deleted successfully!`, 'success');
        renderAdminDashboard('users');
      }
    }
  );
};

// 2. Appointment Management Tab
function renderAdminAppointmentManagement() {
  const appointments = appStore.getAppointments();

  return `
    <div class="space-y-4 mt-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="calendar" class="w-4 h-4 text-teal-600"></i> All Clinic Appointments (${appointments.length})
        </h3>
        <div class="flex items-center gap-2">
          <select id="adminAptStatusFilter" onchange="filterAdminAppointments()" class="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200">
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending Approval</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="adminAptGrid">
        ${appointments.map(apt => `
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                    ${apt.department}
                  </span>
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm mt-1.5">${apt.patientName}</h4>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  apt.status === 'Confirmed' ? 'badge-confirmed' :
                  apt.status === 'Pending' ? 'badge-pending' :
                  apt.status === 'Completed' ? 'badge-completed' : 'badge-cancelled'
                }">
                  ${apt.status}
                </span>
              </div>

              <div class="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div class="flex items-center gap-2">
                  <i data-lucide="user-check" class="w-3.5 h-3.5 text-slate-400"></i> Doctor: <strong class="text-slate-800 dark:text-slate-200">${apt.doctorName}</strong>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i> Slot: <strong>${apt.date} at ${apt.time}</strong>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="file-text" class="w-3.5 h-3.5 text-slate-400"></i> Type: <span>${apt.type || 'General'}</span>
                </div>
                ${apt.reason ? `<p class="mt-2 text-[11px] italic bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">"${apt.reason}"</p>` : ''}
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
              <button onclick="showRescheduleModal('${apt.id}')" class="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950 rounded-lg hover:bg-teal-100 transition">
                Reschedule
              </button>
              ${apt.status === 'Pending' ? `
                <button onclick="updateAptStatusAdmin('${apt.id}', 'Confirmed')" class="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition">
                  Approve
                </button>
              ` : ''}
              ${apt.status !== 'Cancelled' ? `
                <button onclick="updateAptStatusAdmin('${apt.id}', 'Cancelled')" class="px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition">
                  Cancel
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.filterAdminAppointments = function() {
  const status = document.getElementById('adminAptStatusFilter').value;
  const appointments = appStore.getAppointments({ status });
  const grid = document.getElementById('adminAptGrid');
  if (grid) {
    grid.innerHTML = appointments.map(apt => `
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                ${apt.department}
              </span>
              <h4 class="font-bold text-slate-900 dark:text-white text-sm mt-1.5">${apt.patientName}</h4>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${
              apt.status === 'Confirmed' ? 'badge-confirmed' :
              apt.status === 'Pending' ? 'badge-pending' :
              apt.status === 'Completed' ? 'badge-completed' : 'badge-cancelled'
            }">
              ${apt.status}
            </span>
          </div>

          <div class="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-2">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-slate-400"></i> Doctor: <strong class="text-slate-800 dark:text-slate-200">${apt.doctorName}</strong>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i> Slot: <strong>${apt.date} at ${apt.time}</strong>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
          <button onclick="showRescheduleModal('${apt.id}')" class="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950 rounded-lg hover:bg-teal-100 transition">
            Reschedule
          </button>
          ${apt.status !== 'Cancelled' ? `
            <button onclick="updateAptStatusAdmin('${apt.id}', 'Cancelled')" class="px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition">
              Cancel
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }
};

window.updateAptStatusAdmin = function(aptId, status) {
  if (appStore.updateAppointmentStatus(aptId, status)) {
    showToast(`Appointment status updated to ${status}.`, 'success');
    renderAdminDashboard('appointments');
  }
};

// 3. System Settings Tab
function renderAdminSystemSettings() {
  const settings = appStore.getSystemSettings();

  return `
    <div class="max-w-4xl mx-auto space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="sliders" class="w-5 h-5 text-teal-600"></i> Clinic System Configurations
            </h3>
            <p class="text-xs text-slate-500">Manage global operational variables and automated clinic workflows.</p>
          </div>
          <button onclick="saveAdminSettings()" class="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-1.5">
            <i data-lucide="save" class="w-4 h-4"></i> Save Settings
          </button>
        </div>

        <form id="adminSettingsForm" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Clinic Name</label>
              <input type="text" id="setClinicName" value="${settings.clinicName}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Official Support Email</label>
              <input type="email" id="setClinicEmail" value="${settings.clinicEmail}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Operating Start Time</label>
              <input type="time" id="setOpStart" value="${settings.operatingHoursStart}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Operating End Time</label>
              <input type="time" id="setOpEnd" value="${settings.operatingHoursEnd}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Hotline</label>
              <input type="text" id="setEmergency" value="${settings.emergencyContact}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
          </div>

          <div class="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">System Toggles</h4>
            
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <div class="text-xs font-bold text-slate-800 dark:text-slate-200">Auto-Confirm Patient Appointments</div>
                <div class="text-[11px] text-slate-500">Automatically confirm new online appointment bookings without manual approval.</div>
              </div>
              <input type="checkbox" id="setAutoConfirm" ${settings.autoConfirmAppointments ? 'checked' : ''} class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <div class="text-xs font-bold text-slate-800 dark:text-slate-200">Email & SMS Alerts</div>
                <div class="text-[11px] text-slate-500">Send automatic booking reminders to patients and doctors.</div>
              </div>
              <input type="checkbox" id="setNotifs" ${settings.emailNotifications ? 'checked' : ''} class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
              <div>
                <div class="text-xs font-bold text-rose-800 dark:text-rose-300">System Maintenance Mode</div>
                <div class="text-[11px] text-rose-600 dark:text-rose-400">Lock patient appointment booking during server updates.</div>
              </div>
              <input type="checkbox" id="setMaintenance" ${settings.maintenanceMode ? 'checked' : ''} class="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
            </div>
          </div>
        </form>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span class="text-xs text-slate-500">Reset system back to factory demo dataset?</span>
          <button onclick="resetSystemDataData()" class="px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition">
            Reset All Sample Data
          </button>
        </div>

      </div>
    </div>
  `;
}

window.saveAdminSettings = function() {
  const clinicName = document.getElementById('setClinicName').value.trim();
  const clinicEmail = document.getElementById('setClinicEmail').value.trim();
  const operatingHoursStart = document.getElementById('setOpStart').value;
  const operatingHoursEnd = document.getElementById('setOpEnd').value;
  const emergencyContact = document.getElementById('setEmergency').value.trim();
  const autoConfirmAppointments = document.getElementById('setAutoConfirm').checked;
  const emailNotifications = document.getElementById('setNotifs').checked;
  const maintenanceMode = document.getElementById('setMaintenance').checked;

  appStore.updateSystemSettings({
    clinicName,
    clinicEmail,
    operatingHoursStart,
    operatingHoursEnd,
    emergencyContact,
    autoConfirmAppointments,
    emailNotifications,
    maintenanceMode
  });

  showToast('System settings updated successfully!', 'success');
};

window.resetSystemDataData = function() {
  showConfirmDeleteModal(
    'Reset All System Data?',
    'This will clear all custom users, appointments, and settings and restore initial sample data.',
    () => {
      appStore.resetToSeed();
      showToast('System reset to default seed state.', 'info');
      renderAdminDashboard('settings');
    }
  );
};

// 4. Performance Analytics Tab
function renderAdminPerformanceAnalytics() {
  const summary = appStore.getAnalyticsSummary();

  return `
    <div class="space-y-6 mt-6">
      <!-- KPI Metric Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Patients</span>
            <i data-lucide="users" class="w-5 h-5 text-teal-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white">${summary.totalPatients}</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <i data-lucide="trending-up" class="w-3 h-3"></i> +12% this month
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Active Doctors</span>
            <i data-lucide="stethoscope" class="w-5 h-5 text-cyan-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white">${summary.totalDoctors}</div>
          <div class="text-[11px] text-slate-500 font-semibold mt-1">across 3 departments</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bookings</span>
            <i data-lucide="calendar-check-2" class="w-5 h-5 text-emerald-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white">${summary.totalAppointments}</div>
          <div class="text-[11px] text-amber-600 font-semibold mt-1">${summary.pendingAppointments} pending review</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Satisfaction</span>
            <i data-lucide="heart" class="w-5 h-5 text-rose-500"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white">${summary.satisfactionRate}</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-1">Based on 48 reviews</div>
        </div>
      </div>

      <!-- Chart Graphs -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Monthly Appointments Trend (Line Chart) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i data-lucide="line-chart" class="w-4 h-4 text-teal-600"></i> Appointment Volume Trends
            </h4>
            <span class="text-xs text-slate-500">Monthly breakdown</span>
          </div>
          <div class="h-64 relative">
            <canvas id="monthlyTrendChart"></canvas>
          </div>
        </div>

        <!-- Specialty Distribution (Doughnut Chart) -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i data-lucide="pie-chart" class="w-4 h-4 text-teal-600"></i> Consultations by Specialty
            </h4>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="specialtyChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initAdminAnalyticsCharts() {
  setTimeout(() => {
    // 1. Monthly Trend
    const ctx1 = document.getElementById('monthlyTrendChart');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          datasets: [{
            label: 'Booked Appointments',
            data: [35, 42, 58, 64, 78, 92],
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#0d9488'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.5)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Specialty Chart
    const ctx2 = document.getElementById('specialtyChart');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Cardiology', 'Neurology', 'Pediatrics', 'General Medicine'],
          datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: ['#0d9488', '#06b6d4', '#8b5cf6', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }, 100);
}
