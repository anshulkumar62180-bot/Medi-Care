/**
 * MediCare Pulse - Shared Modal Component Handlers
 */

window.openModal = function(titleHtml, bodyHtml, footerHtml = '') {
  const backdrop = document.getElementById('modalBackdrop');
  const container = document.getElementById('modalContainer');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const footer = document.getElementById('modalFooter');

  title.innerHTML = titleHtml;
  body.innerHTML = bodyHtml;
  footer.innerHTML = footerHtml;

  backdrop.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  setTimeout(() => {
    container.classList.remove('scale-95', 'opacity-0');
    container.classList.add('scale-100', 'opacity-100');
  }, 10);

  lucide.createIcons();
};

window.closeModal = function() {
  const backdrop = document.getElementById('modalBackdrop');
  const container = document.getElementById('modalContainer');

  container.classList.remove('scale-100', 'opacity-100');
  container.classList.add('scale-95', 'opacity-0');

  setTimeout(() => {
    backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }, 200);
};

// Event listener for modal close button & backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');
  
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
});

// --- Modal 1: Add or Edit User (Admin) ---
window.showAddEditUserModal = function(userToEdit = null) {
  const isEdit = !!userToEdit;
  const title = isEdit ? `<i data-lucide="user-check" class="text-teal-600"></i> Edit User Account` : `<i data-lucide="user-plus" class="text-teal-600"></i> Create New User Account`;

  const body = `
    <form id="userForm" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
          <input type="text" id="formUserName" required value="${userToEdit ? userToEdit.name : ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Dr. John Doe" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
          <input type="email" id="formUserEmail" required value="${userToEdit ? userToEdit.email : ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="john.doe@medicare.org" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">User Role *</label>
          <select id="formUserRole" required class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="patient" ${userToEdit && userToEdit.role === 'patient' ? 'selected' : ''}>Patient</option>
            <option value="doctor" ${userToEdit && userToEdit.role === 'doctor' ? 'selected' : ''}>Doctor</option>
            <option value="admin" ${userToEdit && userToEdit.role === 'admin' ? 'selected' : ''}>Administrator</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
          <input type="text" id="formUserPhone" value="${userToEdit ? userToEdit.phone || '' : ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department / Specialty</label>
          <input type="text" id="formUserDept" value="${userToEdit ? userToEdit.department || userToEdit.specialty || '' : ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Cardiology" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Status</label>
          <select id="formUserStatus" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="Active" ${userToEdit && userToEdit.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${userToEdit && userToEdit.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
    </form>
  `;

  const footer = `
    <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
    <button onclick="submitUserForm('${userToEdit ? userToEdit.id : ''}')" class="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-1.5">
      <i data-lucide="check" class="w-4 h-4"></i> ${isEdit ? 'Update Account' : 'Create Account'}
    </button>
  `;

  openModal(title, body, footer);
};

window.submitUserForm = function(userId = '') {
  const name = document.getElementById('formUserName').value.trim();
  const email = document.getElementById('formUserEmail').value.trim();
  const role = document.getElementById('formUserRole').value;
  const phone = document.getElementById('formUserPhone').value.trim();
  const dept = document.getElementById('formUserDept').value.trim();
  const status = document.getElementById('formUserStatus').value;

  if (!name || !email) {
    showToast('Please fill in all required fields (Name and Email).', 'warning');
    return;
  }

  if (userId) {
    appStore.updateUser(userId, { name, email, role, phone, department: dept, status });
    showToast(`User ${name} updated successfully!`, 'success');
  } else {
    appStore.addUser({ name, email, role, phone, department: dept, status });
    showToast(`User ${name} created successfully!`, 'success');
  }

  closeModal();
};

// --- Modal 2: Book / Schedule Appointment ---
window.showBookAppointmentModal = function(preselectedDoctorId = null) {
  const doctors = appStore.getUsers('doctor');
  const currentPatient = appStore.state.currentUser.role === 'patient' ? appStore.state.currentUser : appStore.getUsers('patient')[0];
  const allPatients = appStore.getUsers('patient');

  const title = `<i data-lucide="calendar-plus" class="text-teal-600"></i> Schedule New Appointment`;

  const body = `
    <form id="aptForm" class="space-y-4">
      ${appStore.state.currentRole === 'admin' ? `
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Patient *</label>
          <select id="aptPatientId" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
            ${allPatients.map(p => `<option value="${p.id}">${p.name} (${p.email})</option>`).join('')}
          </select>
        </div>
      ` : `<input type="hidden" id="aptPatientId" value="${currentPatient.id}" />`}

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Doctor & Specialty *</label>
        <select id="aptDoctorId" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
          ${doctors.map(d => `<option value="${d.id}" ${preselectedDoctorId === d.id ? 'selected' : ''}>${d.name} — ${d.department || 'General Medicine'}</option>`).join('')}
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Appointment Date *</label>
          <input type="date" id="aptDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Time Slot *</label>
          <select id="aptTime" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="09:00 AM">09:00 AM</option>
            <option value="09:30 AM">09:30 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="03:30 PM">03:30 PM</option>
            <option value="04:30 PM">04:30 PM</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Consultation Type</label>
        <select id="aptType" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="General Checkup">General Checkup</option>
          <option value="Follow-up Consultation">Follow-up Consultation</option>
          <option value="Specialist Consultation">Specialist Consultation</option>
          <option value="Lab Review">Lab Review</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Visit / Symptoms</label>
        <textarea id="aptReason" rows="3" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Briefly describe what you'd like to consult the doctor about..."></textarea>
      </div>
    </form>
  `;

  const footer = `
    <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
    <button onclick="submitBookAptForm()" class="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-1.5">
      <i data-lucide="calendar-check" class="w-4 h-4"></i> Confirm Booking
    </button>
  `;

  openModal(title, body, footer);
};

window.submitBookAptForm = function() {
  const patientId = document.getElementById('aptPatientId').value;
  const doctorId = document.getElementById('aptDoctorId').value;
  const date = document.getElementById('aptDate').value;
  const time = document.getElementById('aptTime').value;
  const type = document.getElementById('aptType').value;
  const reason = document.getElementById('aptReason').value.trim();

  if (!date || !time) {
    showToast('Please select a valid date and time slot.', 'warning');
    return;
  }

  appStore.bookAppointment({
    patientId,
    doctorId,
    date,
    time,
    type,
    reason
  });

  showToast('Appointment booked successfully!', 'success');
  closeModal();
};

// --- Modal 3: Reschedule Appointment ---
window.showRescheduleModal = function(aptId) {
  const apt = appStore.state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  const title = `<i data-lucide="clock" class="text-teal-600"></i> Reschedule Appointment #${aptId.slice(-4)}`;

  const body = `
    <p class="text-xs text-slate-500 dark:text-slate-400">Rescheduling appointment with <strong class="text-slate-800 dark:text-slate-200">${apt.doctorName}</strong> for patient <strong class="text-slate-800 dark:text-slate-200">${apt.patientName}</strong>.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Date *</label>
        <input type="date" id="reschedDate" value="${apt.date}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Time Slot *</label>
        <select id="reschedTime" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="09:00 AM">09:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:30 AM">11:30 AM</option>
          <option value="02:30 PM">02:30 PM</option>
          <option value="04:00 PM">04:00 PM</option>
        </select>
      </div>
    </div>
  `;

  const footer = `
    <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
    <button onclick="submitReschedule('${aptId}')" class="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition">Save Changes</button>
  `;

  openModal(title, body, footer);
};

window.submitReschedule = function(aptId) {
  const date = document.getElementById('reschedDate').value;
  const time = document.getElementById('reschedTime').value;

  if (appStore.rescheduleAppointment(aptId, date, time)) {
    showToast('Appointment rescheduled successfully!', 'success');
  }
  closeModal();
};

// --- Modal 4: Edit Medical Record (Doctor) ---
window.showEditMedicalRecordModal = function(patientId, recordToEdit = null) {
  const patient = appStore.state.users.find(u => u.id === patientId);
  const isEdit = !!recordToEdit;
  const title = isEdit ? `<i data-lucide="file-text" class="text-teal-600"></i> Edit Medical Record` : `<i data-lucide="file-plus" class="text-teal-600"></i> New Clinical Record for ${patient ? patient.name : 'Patient'}`;

  const body = `
    <form id="recordForm" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Clinical Diagnosis *</label>
        <input type="text" id="recDiagnosis" required value="${recordToEdit ? recordToEdit.diagnosis : ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Mild Hypertension" />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Prescription & Medications</label>
        <textarea id="recPrescription" rows="2" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Medication dosage & frequency...">${recordToEdit ? recordToEdit.prescription : ''}</textarea>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Blood Pressure</label>
          <input type="text" id="recBP" value="${recordToEdit && recordToEdit.vitals ? recordToEdit.vitals.bp || '' : '120/80 mmHg'}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Heart Rate</label>
          <input type="text" id="recPulse" value="${recordToEdit && recordToEdit.vitals ? recordToEdit.vitals.pulse || '' : '72 bpm'}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Body Temp</label>
          <input type="text" id="recTemp" value="${recordToEdit && recordToEdit.vitals ? recordToEdit.vitals.temp || '' : '98.6 °F'}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Weight</label>
          <input type="text" id="recWeight" value="${recordToEdit && recordToEdit.vitals ? recordToEdit.vitals.weight || '' : '75 kg'}" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Known Allergies</label>
        <input type="text" id="recAllergies" value="${recordToEdit ? recordToEdit.allergies || '' : 'None reported'}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Clinical Notes & Observations</label>
        <textarea id="recNotes" rows="3" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Detailed physician notes...">${recordToEdit ? recordToEdit.notes || '' : ''}</textarea>
      </div>
    </form>
  `;

  const footer = `
    <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
    <button onclick="submitRecordForm('${patientId}', '${recordToEdit ? recordToEdit.id : ''}')" class="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-1">
      <i data-lucide="save" class="w-4 h-4"></i> Save Record
    </button>
  `;

  openModal(title, body, footer);
};

window.submitRecordForm = function(patientId, recordId = '') {
  const diagnosis = document.getElementById('recDiagnosis').value.trim();
  const prescription = document.getElementById('recPrescription').value.trim();
  const bp = document.getElementById('recBP').value;
  const pulse = document.getElementById('recPulse').value;
  const temp = document.getElementById('recTemp').value;
  const weight = document.getElementById('recWeight').value;
  const allergies = document.getElementById('recAllergies').value.trim();
  const notes = document.getElementById('recNotes').value.trim();

  if (!diagnosis) {
    showToast('Diagnosis is required.', 'warning');
    return;
  }

  const recordPayload = {
    patientId,
    diagnosis,
    prescription,
    vitals: { bp, pulse, temp, weight },
    allergies,
    notes
  };

  if (recordId) {
    appStore.updateMedicalRecord(recordId, recordPayload);
    showToast('Medical record updated.', 'success');
  } else {
    appStore.addMedicalRecord(recordPayload);
    showToast('New clinical record added to patient chart.', 'success');
  }

  closeModal();
};

// --- Modal 5: Confirm Delete Action ---
window.showConfirmDeleteModal = function(titleText, messageText, onConfirmFn) {
  const title = `<i data-lucide="trash-2" class="text-rose-600"></i> ${titleText}`;
  const body = `<p class="text-sm text-slate-600 dark:text-slate-300">${messageText}</p>`;
  const footer = `
    <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
    <button id="confirmDeleteBtn" class="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition">Delete Permanently</button>
  `;

  openModal(title, body, footer);
  
  setTimeout(() => {
    const btn = document.getElementById('confirmDeleteBtn');
    if (btn) {
      btn.onclick = () => {
        onConfirmFn();
        closeModal();
      };
    }
  }, 50);
};
