/**
 * MediCare Pulse - Doctor Dashboard Views
 */

window.renderDoctorDashboard = function(activeTab = 'schedule') {
  const container = document.getElementById('mainContent');
  if (!container) return;

  const currentDoctor = appStore.state.currentUser.role === 'doctor' 
    ? appStore.state.currentUser 
    : appStore.getUsers('doctor')[0];

  const tabHeader = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-500/20">
          <i data-lucide="stethoscope" class="w-6 h-6"></i>
        </div>
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ${currentDoctor.name}
          </h1>
          <p class="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">${currentDoctor.department || 'Cardiology'} Specialist • ${currentDoctor.rating || 4.9} ★ Rating</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="renderDoctorDashboard('schedule')" class="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition flex items-center gap-1.5">
          <i data-lucide="clock" class="w-4 h-4 text-teal-600"></i> My Schedule
        </button>
      </div>
    </div>
  `;

  let tabContentHtml = '';

  switch (activeTab) {
    case 'schedule':
      tabContentHtml = renderDoctorScheduleManagement(currentDoctor);
      break;
    case 'records':
      tabContentHtml = renderDoctorPatientRecords();
      break;
    case 'appointments':
      tabContentHtml = renderDoctorAppointmentOverview(currentDoctor);
      break;
    case 'feedback':
      tabContentHtml = renderDoctorFeedback(currentDoctor);
      break;
    default:
      tabContentHtml = renderDoctorScheduleManagement(currentDoctor);
      break;
  }

  container.innerHTML = tabHeader + tabContentHtml;
  lucide.createIcons();
};

// 1. Schedule Management View
function renderDoctorScheduleManagement(doctor) {
  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return `
    <div class="space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-teal-600"></i> Weekly Appointment Availability Matrix
          </h3>
          <p class="text-xs text-slate-500">Click any slot to toggle availability (Available / Blocked).</p>
        </div>

        <div class="flex items-center gap-4 text-xs font-semibold">
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Available</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-cyan-500"></span> Booked</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span> Blocked</div>
        </div>
      </div>

      <!-- Interactive Calendar Matrix -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-4">
        <div class="overflow-x-auto">
          <table class="w-full text-center border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800">
                <th class="p-3 text-xs font-bold text-slate-400 text-left w-24">Time Slot</th>
                ${weekDays.map(day => `<th class="p-3 text-xs font-bold text-slate-700 dark:text-slate-300">${day}</th>`).join('')}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${timeSlots.map((time, idx) => `
                <tr>
                  <td class="p-3 text-xs font-semibold text-slate-500 text-left bg-slate-50/50 dark:bg-slate-800/30">${time}</td>
                  ${weekDays.map((day, dIdx) => {
                    const isBooked = (idx === 1 && dIdx === 0) || (idx === 3 && dIdx === 1) || (idx === 4 && dIdx === 3);
                    const isBlocked = (idx === 7 && dIdx === 5);
                    const slotStatus = isBooked ? 'booked' : isBlocked ? 'blocked' : 'available';

                    return `
                      <td class="p-2">
                        <button onclick="toggleSlotStatus(this)" data-status="${slotStatus}" class="w-full py-2 px-1 rounded-xl text-xs font-semibold border transition duration-150 ${
                          slotStatus === 'available' ? 'slot-available' :
                          slotStatus === 'booked' ? 'slot-booked' : 'slot-blocked'
                        }">
                          ${slotStatus === 'booked' ? 'Booked' : slotStatus === 'available' ? 'Available' : 'Off'}
                        </button>
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.toggleSlotStatus = function(btn) {
  const current = btn.getAttribute('data-status');
  if (current === 'booked') {
    showToast('This slot has an active patient booking.', 'info');
    return;
  }
  const next = current === 'available' ? 'blocked' : 'available';
  btn.setAttribute('data-status', next);

  if (next === 'available') {
    btn.className = 'w-full py-2 px-1 rounded-xl text-xs font-semibold border transition duration-150 slot-available';
    btn.innerText = 'Available';
    showToast('Slot updated to Available', 'success');
  } else {
    btn.className = 'w-full py-2 px-1 rounded-xl text-xs font-semibold border transition duration-150 slot-blocked';
    btn.innerText = 'Off';
    showToast('Slot blocked out', 'info');
  }
};

// 2. Patient Records View
function renderDoctorPatientRecords() {
  const patients = appStore.getUsers('patient');
  const records = appStore.state.medicalRecords;

  return `
    <div class="space-y-6 mt-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="folder-heart" class="w-4 h-4 text-teal-600"></i> Patient Clinical Records & Medical Charts
        </h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Patient Selector List -->
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Patient</h4>
          <div class="space-y-2" id="patientListGroup">
            ${patients.map((p, idx) => `
              <button onclick="selectPatientForRecord('${p.id}')" class="w-full text-left p-3 rounded-xl border transition ${idx === 0 ? 'bg-teal-50 border-teal-200 dark:bg-teal-950/60 dark:border-teal-800' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-slate-900 dark:text-white">${p.name}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${p.bloodGroup || 'O+'}</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">${p.gender || 'N/A'} • DOB: ${p.dob || '1994-06-14'}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Detailed Medical Chart View -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm" id="patientRecordDetailArea">
          ${renderPatientMedicalChartDetail(patients[0].id)}
        </div>
      </div>
    </div>
  `;
}

window.selectPatientForRecord = function(patientId) {
  const area = document.getElementById('patientRecordDetailArea');
  if (area) {
    area.innerHTML = renderPatientMedicalChartDetail(patientId);
    lucide.createIcons();
  }
};

function renderPatientMedicalChartDetail(patientId) {
  const patient = appStore.state.users.find(u => u.id === patientId);
  const records = appStore.getMedicalRecords(patientId);

  if (!patient) return `<p class="text-xs text-slate-400">Select a patient to view chart.</p>`;

  return `
    <div class="space-y-5">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            ${patient.name}
          </h3>
          <p class="text-xs text-slate-500">${patient.email} • ${patient.phone}</p>
        </div>
        <button onclick="showEditMedicalRecordModal('${patient.id}')" class="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition flex items-center gap-1.5">
          <i data-lucide="file-plus" class="w-4 h-4"></i> Add New Record
        </button>
      </div>

      <!-- Vitals Overview Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
          <div class="text-sm font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">${patient.bloodGroup || 'O+'}</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Allergies</span>
          <div class="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">${records[0] ? records[0].allergies : 'None reported'}</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Latest BP</span>
          <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">${records[0] && records[0].vitals ? records[0].vitals.bp : '120/80 mmHg'}</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Pulse Rate</span>
          <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">${records[0] && records[0].vitals ? records[0].vitals.pulse : '72 bpm'}</div>
        </div>
      </div>

      <!-- Medical Entries Timeline -->
      <div class="space-y-4 pt-2">
        <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <i data-lucide="history" class="w-4 h-4 text-teal-600"></i> Clinical History Records (${records.length})
        </h4>

        ${records.length === 0 ? `
          <p class="text-xs text-slate-400 italic p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center">No clinical records filed yet. Click "Add New Record" to document a consultation.</p>
        ` : records.map(r => `
          <div class="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-2">
            <div class="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-700/60 pb-2">
              <span class="font-bold text-teal-600 dark:text-teal-400">${r.diagnosis}</span>
              <span class="text-slate-400 font-medium">${r.date}</span>
            </div>
            <div class="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p><strong>Prescription:</strong> ${r.prescription || 'N/A'}</p>
              ${r.notes ? `<p class="text-slate-500 italic">" ${r.notes} "</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 3. Appointment Overview View
function renderDoctorAppointmentOverview(doctor) {
  const appointments = appStore.getAppointments({ doctorId: doctor.id });

  return `
    <div class="space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="clipboard-list" class="w-4 h-4 text-teal-600"></i> My Assigned Patient Appointments (${appointments.length})
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${appointments.map(apt => `
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">${apt.patientName}</h4>
                <div class="text-xs text-slate-400">${apt.patientEmail || ''}</div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${
                apt.status === 'Confirmed' ? 'badge-confirmed' :
                apt.status === 'Completed' ? 'badge-completed' : 'badge-pending'
              }">
                ${apt.status}
              </span>
            </div>

            <div class="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <div><i data-lucide="calendar" class="w-3.5 h-3.5 inline text-slate-400 mr-1"></i> Date & Time: <strong>${apt.date} at ${apt.time}</strong></div>
              <div><i data-lucide="activity" class="w-3.5 h-3.5 inline text-slate-400 mr-1"></i> Visit Reason: <span class="italic text-slate-700 dark:text-slate-300">"${apt.reason || 'Routine'}"</span></div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
              ${apt.status !== 'Completed' ? `
                <button onclick="updateDoctorAptStatus('${apt.id}', 'Completed')" class="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition">
                  Mark Completed
                </button>
              ` : ''}
              <button onclick="showEditMedicalRecordModal('${apt.patientId}')" class="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950 rounded-lg hover:bg-teal-100 transition">
                Write Clinical Notes
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.updateDoctorAptStatus = function(id, status) {
  if (appStore.updateAppointmentStatus(id, status)) {
    showToast(`Appointment marked as ${status}.`, 'success');
    renderDoctorDashboard('appointments');
  }
};

// 4. Patient Feedback View
function renderDoctorFeedback(doctor) {
  const feedbackList = appStore.getFeedback(doctor.id);

  return `
    <div class="space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="star" class="w-5 h-5 text-amber-500 fill-amber-500"></i> Patient Reviews & Feedback
          </h3>
          <p class="text-xs text-slate-500">Direct ratings and clinical feedback submitted by patients.</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white">${doctor.rating || 4.9} / 5.0</div>
          <div class="text-xs text-amber-500 font-bold">★★★★★ (${feedbackList.length} reviews)</div>
        </div>
      </div>

      <div class="space-y-4">
        ${feedbackList.map(f => `
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white text-xs">${f.patientName}</span>
              <span class="text-xs font-bold text-amber-500">
                ${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 italic">"${f.comment}"</p>
            <div class="text-[10px] text-slate-400 font-medium text-right">${f.date}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
