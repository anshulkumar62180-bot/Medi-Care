/**
 * MediCare Pulse - Patient Dashboard Views
 */

window.renderPatientDashboard = function(activeTab = 'book') {
  const container = document.getElementById('mainContent');
  if (!container) return;

  const currentPatient = appStore.state.currentUser.role === 'patient'
    ? appStore.state.currentUser
    : appStore.getUsers('patient')[0];

  const tabHeader = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-500/20">
          <i data-lucide="user" class="w-6 h-6"></i>
        </div>
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, ${currentPatient.name}
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Manage your consultations, view medical records, and update your personal health profile.</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="renderPatientDashboard('book')" class="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-1.5">
          <i data-lucide="calendar-plus" class="w-4 h-4"></i> Book New Appointment
        </button>
      </div>
    </div>
  `;

  let tabContentHtml = '';

  switch (activeTab) {
    case 'book':
      tabContentHtml = renderPatientBookingWizard(currentPatient);
      break;
    case 'history':
      tabContentHtml = renderPatientAppointmentHistory(currentPatient);
      break;
    case 'records':
      tabContentHtml = renderPatientMedicalHistory(currentPatient);
      break;
    case 'profile':
      tabContentHtml = renderPatientProfileManagement(currentPatient);
      break;
    default:
      tabContentHtml = renderPatientBookingWizard(currentPatient);
      break;
  }

  container.innerHTML = tabHeader + tabContentHtml;
  lucide.createIcons();
};

// 1. Interactive Step-by-Step Appointment Booking Wizard
function renderPatientBookingWizard(patient) {
  const doctors = appStore.getUsers('doctor');
  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'General Medicine'];

  return `
    <div class="max-w-4xl mx-auto space-y-6 mt-6">
      
      <!-- Wizard Progress Header -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <i data-lucide="sparkles" class="w-5 h-5 text-teal-600"></i> Online Appointment Booking Wizard
        </h3>

        <!-- Stepper Indicator -->
        <div class="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div id="step1Indicator" class="p-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            1. Department
          </div>
          <div id="step2Indicator" class="p-2 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            2. Doctor
          </div>
          <div id="step3Indicator" class="p-2 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            3. Date & Slot
          </div>
          <div id="step4Indicator" class="p-2 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            4. Confirm
          </div>
        </div>
      </div>

      <!-- Step Content Box -->
      <div id="wizardStepContainer" class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        ${renderWizardStep1(departments)}
      </div>

    </div>
  `;
}

// Wizard Step 1: Select Department
function renderWizardStep1(departments) {
  return `
    <div class="space-y-4">
      <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">Step 1: Choose Medical Department</h4>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${departments.map(dept => `
          <button onclick="selectWizardDept('${dept}')" class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition text-center space-y-2 group">
            <div class="w-10 h-10 mx-auto rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
              <i data-lucide="${dept === 'Cardiology' ? 'heart' : dept === 'Neurology' ? 'brain' : dept === 'Pediatrics' ? 'baby' : 'stethoscope'}" class="w-5 h-5"></i>
            </div>
            <div class="font-bold text-xs text-slate-900 dark:text-white">${dept}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

window.wizardData = { department: '', doctorId: '', doctorName: '', date: '', time: '', reason: '' };

window.selectWizardDept = function(dept) {
  window.wizardData.department = dept;
  
  // Highlight stepper 2
  document.getElementById('step2Indicator').className = 'p-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800';

  const doctors = appStore.getUsers('doctor').filter(d => !dept || d.department === dept || d.specialty.includes(dept));

  const container = document.getElementById('wizardStepContainer');
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">Step 2: Choose Specialist Doctor (${dept})</h4>
        <button onclick="renderPatientDashboard('book')" class="text-xs text-teal-600 font-semibold">← Back</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${doctors.map(d => `
          <div onclick="selectWizardDoctor('${d.id}', '${d.name}')" class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 cursor-pointer hover:shadow-md transition flex items-center space-x-4 bg-slate-50/50 dark:bg-slate-800/40">
            <div class="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-sm border-2 border-teal-500/30">
              ${d.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
            </div>
            <div>
              <h5 class="font-bold text-sm text-slate-900 dark:text-white">${d.name}</h5>
              <div class="text-xs text-teal-600 font-medium">${d.specialty}</div>
              <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span><i data-lucide="award" class="w-3 h-3 inline"></i> ${d.experience}</span>
                <span class="text-amber-500 font-bold">★ ${d.rating}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  lucide.createIcons();
};

window.selectWizardDoctor = function(docId, docName) {
  window.wizardData.doctorId = docId;
  window.wizardData.doctorName = docName;

  document.getElementById('step3Indicator').className = 'p-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800';

  const container = document.getElementById('wizardStepContainer');
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">Step 3: Select Date & Time Slot</h4>
        <span class="text-xs font-bold text-teal-600">Selected: ${docName}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Appointment Date *</label>
          <input type="date" id="wizDate" value="${new Date().toISOString().split('T')[0]}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Available Time Slot *</label>
          <select id="wizTime" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100">
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:30 AM">11:30 AM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="03:30 PM">03:30 PM</option>
            <option value="04:30 PM">04:30 PM</option>
          </select>
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button onclick="goToWizardStep4()" class="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-1.5">
          Next: Review & Confirm <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();
};

window.goToWizardStep4 = function() {
  window.wizardData.date = document.getElementById('wizDate').value;
  window.wizardData.time = document.getElementById('wizTime').value;

  document.getElementById('step4Indicator').className = 'p-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800';

  const container = document.getElementById('wizardStepContainer');
  container.innerHTML = `
    <div class="space-y-4">
      <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">Step 4: Confirm Booking Details</h4>

      <div class="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 space-y-2 text-xs">
        <div>Department: <strong class="text-slate-900 dark:text-white">${window.wizardData.department}</strong></div>
        <div>Consulting Doctor: <strong class="text-slate-900 dark:text-white">${window.wizardData.doctorName}</strong></div>
        <div>Date & Time: <strong class="text-teal-700 dark:text-teal-300">${window.wizardData.date} at ${window.wizardData.time}</strong></div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Visit / Main Symptoms</label>
        <textarea id="wizReason" rows="3" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500" placeholder="Please describe any symptoms or checkup goals..."></textarea>
      </div>

      <div class="pt-4 flex justify-end space-x-3">
        <button onclick="renderPatientDashboard('book')" class="px-4 py-2 text-xs font-semibold text-slate-500">Cancel</button>
        <button onclick="submitWizardBooking()" class="px-6 py-2.5 text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/20 transition flex items-center gap-1.5">
          <i data-lucide="check-circle" class="w-4 h-4"></i> Complete Appointment Booking
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();
};

window.submitWizardBooking = function() {
  const reason = document.getElementById('wizReason').value.trim();
  const currentPatient = appStore.state.currentUser;

  appStore.bookAppointment({
    patientId: currentPatient.id,
    doctorId: window.wizardData.doctorId,
    date: window.wizardData.date,
    time: window.wizardData.time,
    reason: reason
  });

  showToast('Appointment booked successfully!', 'success');
  renderPatientDashboard('history');
};

// 2. Appointment History View
function renderPatientAppointmentHistory(patient) {
  const appointments = appStore.getAppointments({ patientId: patient.id });

  return `
    <div class="space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="calendar" class="w-4 h-4 text-teal-600"></i> My Personal Appointment History (${appointments.length})
        </h3>
      </div>

      <div class="space-y-4">
        ${appointments.length === 0 ? `
          <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <i data-lucide="calendar-x" class="w-10 h-10 text-slate-400 mx-auto mb-2"></i>
            <p class="text-xs text-slate-500 font-medium">You have no booked appointments yet.</p>
            <button onclick="renderPatientDashboard('book')" class="mt-3 px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-xl">Book First Consultation</button>
          </div>
        ` : appointments.map(apt => `
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-extrabold text-teal-600 dark:text-teal-400">${apt.department}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  apt.status === 'Confirmed' ? 'badge-confirmed' :
                  apt.status === 'Completed' ? 'badge-completed' :
                  apt.status === 'Pending' ? 'badge-pending' : 'badge-cancelled'
                }">
                  ${apt.status}
                </span>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Dr. ${apt.doctorName}</h4>
              <div class="text-xs text-slate-500">Date: <strong>${apt.date} at ${apt.time}</strong></div>
              ${apt.notes ? `<p class="text-[11px] text-slate-600 dark:text-slate-400 italic">Doctor Note: "${apt.notes}"</p>` : ''}
            </div>

            <div class="flex items-center space-x-2">
              ${apt.status === 'Confirmed' || apt.status === 'Pending' ? `
                <button onclick="showRescheduleModal('${apt.id}')" class="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950 rounded-lg hover:bg-teal-100 transition">
                  Reschedule
                </button>
                <button onclick="cancelPatientApt('${apt.id}')" class="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition">
                  Cancel Booking
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.cancelPatientApt = function(id) {
  if (appStore.updateAppointmentStatus(id, 'Cancelled')) {
    showToast('Appointment cancelled.', 'info');
    renderPatientDashboard('history');
  }
};

// 3. Medical History View
function renderPatientMedicalHistory(patient) {
  const records = appStore.getMedicalRecords(patient.id);

  return `
    <div class="space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="activity" class="w-4 h-4 text-teal-600"></i> Personal Medical History & Prescriptions
        </h3>
      </div>

      <div class="space-y-4">
        ${records.length === 0 ? `
          <p class="text-xs text-slate-400 italic p-6 bg-white dark:bg-slate-900 rounded-2xl text-center">No past medical history records logged yet.</p>
        ` : records.map(r => `
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span class="font-extrabold text-sm text-slate-900 dark:text-white">${r.diagnosis}</span>
              <span class="text-xs text-slate-400 font-medium">${r.date}</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <strong>Prescribed Medication:</strong>
                <p class="text-teal-700 dark:text-teal-300 font-medium mt-0.5">${r.prescription}</p>
              </div>
              <div>
                <strong>Consulting Physician:</strong>
                <p class="text-slate-800 dark:text-slate-200 mt-0.5">${r.doctorName}</p>
              </div>
            </div>

            ${r.vitals ? `
              <div class="flex items-center gap-4 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-slate-600 dark:text-slate-400">
                <span>BP: <strong class="text-slate-800 dark:text-slate-200">${r.vitals.bp}</strong></span>
                <span>Pulse: <strong class="text-slate-800 dark:text-slate-200">${r.vitals.pulse}</strong></span>
                <span>Temp: <strong class="text-slate-800 dark:text-slate-200">${r.vitals.temp}</strong></span>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 4. Profile Management View
function renderPatientProfileManagement(patient) {
  return `
    <div class="max-w-3xl mx-auto space-y-6 mt-6">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="user-check" class="w-5 h-5 text-teal-600"></i> Personal Health Profile Settings
          </h3>
          <button onclick="savePatientProfile('${patient.id}')" class="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-1.5">
            <i data-lucide="save" class="w-4 h-4"></i> Save Profile
          </button>
        </div>

        <form id="patientProfileForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input type="text" id="profName" value="${patient.name}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" id="profEmail" value="${patient.email}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input type="text" id="profPhone" value="${patient.phone || ''}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
              <select id="profBlood" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100">
                <option value="O+" ${patient.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                <option value="A+" ${patient.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                <option value="B+" ${patient.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                <option value="AB-" ${patient.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
              <input type="date" id="profDob" value="${patient.dob || '1994-06-14'}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Contact Details</label>
            <input type="text" id="profEmergency" value="${patient.emergencyContact || ''}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100" placeholder="Contact name & phone number..." />
          </div>
        </form>
      </div>
    </div>
  `;
}

window.savePatientProfile = function(patientId) {
  const name = document.getElementById('profName').value.trim();
  const email = document.getElementById('profEmail').value.trim();
  const phone = document.getElementById('profPhone').value.trim();
  const bloodGroup = document.getElementById('profBlood').value;
  const dob = document.getElementById('profDob').value;
  const emergencyContact = document.getElementById('profEmergency').value.trim();

  appStore.updateUser(patientId, { name, email, phone, bloodGroup, dob, emergencyContact });
  showToast('Profile updated successfully!', 'success');
};
