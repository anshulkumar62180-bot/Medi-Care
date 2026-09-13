/**
 * MediCare Pulse - Production Central Store with Cloud Firestore & Realtime Sync
 */

const STORAGE_KEY = 'medicare_pulse_app_state_v1';

const INITIAL_SEED_DATA = {
  currentRole: 'admin',
  currentUser: {
    id: 'usr_admin_1',
    name: 'Dr. Arthur Pendelton',
    email: 'admin@medicare.org',
    role: 'admin',
    avatar: 'AP',
    department: 'Hospital Operations'
  },
  
  users: [
    {
      id: 'usr_admin_1',
      name: 'Dr. Arthur Pendelton',
      email: 'admin@medicare.org',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      department: 'Administration',
      status: 'Active',
      createdAt: '2025-01-10'
    },
    {
      id: 'usr_doc_1',
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.j@medicare.org',
      role: 'doctor',
      phone: '+1 (555) 234-5678',
      department: 'Cardiology',
      specialty: 'Interventional Cardiology',
      experience: '12 Years',
      rating: 4.9,
      status: 'Active',
      createdAt: '2025-02-01'
    },
    {
      id: 'usr_doc_2',
      name: 'Dr. Michael Chen',
      email: 'michael.c@medicare.org',
      role: 'doctor',
      phone: '+1 (555) 345-6789',
      department: 'Neurology',
      specialty: 'Cognitive Neurology',
      experience: '9 Years',
      rating: 4.8,
      status: 'Active',
      createdAt: '2025-02-15'
    },
    {
      id: 'usr_doc_3',
      name: 'Dr. Elena Rostova',
      email: 'elena.r@medicare.org',
      role: 'doctor',
      phone: '+1 (555) 456-7890',
      department: 'Pediatrics',
      specialty: 'Pediatric Care & Allergy',
      experience: '15 Years',
      rating: 5.0,
      status: 'Active',
      createdAt: '2025-03-01'
    },
    {
      id: 'usr_pat_1',
      name: 'Alex Morgan',
      email: 'alex.m@example.com',
      role: 'patient',
      phone: '+1 (555) 987-6543',
      dob: '1994-06-14',
      gender: 'Male',
      bloodGroup: 'O+',
      emergencyContact: 'Rachel Morgan (+1 555-987-0000)',
      address: '742 Evergreen Terrace, Springfield',
      status: 'Active',
      createdAt: '2025-04-10'
    },
    {
      id: 'usr_pat_2',
      name: 'Emily Watson',
      email: 'emily.w@example.com',
      role: 'patient',
      phone: '+1 (555) 876-5432',
      dob: '1998-11-22',
      gender: 'Female',
      bloodGroup: 'A+',
      emergencyContact: 'John Watson (+1 555-876-0000)',
      address: '128 Baker Street, Suite 4',
      status: 'Active',
      createdAt: '2025-05-12'
    },
    {
      id: 'usr_pat_3',
      name: 'Robert Taylor',
      email: 'robert.t@example.com',
      role: 'patient',
      phone: '+1 (555) 765-4321',
      dob: '1972-03-08',
      gender: 'Male',
      bloodGroup: 'B+',
      emergencyContact: 'Susan Taylor (+1 555-765-0000)',
      address: '405 Pinehurst Ave, New York',
      status: 'Active',
      createdAt: '2025-06-20'
    },
    {
      id: 'usr_pat_4',
      name: 'Sophia Martinez',
      email: 'sophia.m@example.com',
      role: 'patient',
      phone: '+1 (555) 654-3210',
      dob: '1985-09-30',
      gender: 'Female',
      bloodGroup: 'AB-',
      emergencyContact: 'Carlos Martinez (+1 555-654-0000)',
      address: '912 Ocean Drive, Miami',
      status: 'Active',
      createdAt: '2025-07-04'
    }
  ],

  appointments: [
    {
      id: 'apt_101',
      patientId: 'usr_pat_1',
      patientName: 'Alex Morgan',
      patientEmail: 'alex.m@example.com',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-09-14',
      time: '09:30 AM',
      type: 'General Checkup',
      status: 'Confirmed',
      reason: 'Routine annual cardiovascular screening and BP evaluation.',
      notes: 'Patient reported slight fatigue after workouts.'
    },
    {
      id: 'apt_102',
      patientId: 'usr_pat_2',
      patientName: 'Emily Watson',
      patientEmail: 'emily.w@example.com',
      doctorId: 'usr_doc_2',
      doctorName: 'Dr. Michael Chen',
      department: 'Neurology',
      date: '2026-09-14',
      time: '11:00 AM',
      type: 'Follow-up Consultation',
      status: 'Pending',
      reason: 'Migraine follow-up and prescription adjustments.',
      notes: 'Evaluate response to new medication cycle.'
    },
    {
      id: 'apt_103',
      patientId: 'usr_pat_3',
      patientName: 'Robert Taylor',
      patientEmail: 'robert.t@example.com',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-09-12',
      time: '02:00 PM',
      type: 'ECG Review',
      status: 'Completed',
      reason: 'Chest stiffness after stair climbing.',
      notes: 'ECG normal. Recommended cholesterol panel and 30-min daily walking.'
    },
    {
      id: 'apt_104',
      patientId: 'usr_pat_4',
      patientName: 'Sophia Martinez',
      patientEmail: 'sophia.m@example.com',
      doctorId: 'usr_doc_3',
      doctorName: 'Dr. Elena Rostova',
      department: 'Pediatrics',
      date: '2026-09-15',
      time: '10:00 AM',
      type: 'Child Immunization',
      status: 'Confirmed',
      reason: 'Annual pediatric health check and booster shot.',
      notes: 'Bring vaccination card.'
    }
  ],

  medicalRecords: [
    {
      id: 'rec_01',
      patientId: 'usr_pat_1',
      patientName: 'Alex Morgan',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Sarah Jenkins',
      date: '2026-08-10',
      diagnosis: 'Mild Hypertension (Stage 1)',
      prescription: 'Lisinopril 10mg once daily in morning. Low-sodium diet.',
      vitals: { bp: '135/88 mmHg', pulse: '74 bpm', temp: '98.6 °F', weight: '78 kg' },
      allergies: 'Penicillin',
      notes: 'Patient advised to monitor morning BP daily.'
    },
    {
      id: 'rec_02',
      patientId: 'usr_pat_2',
      patientName: 'Emily Watson',
      doctorId: 'usr_doc_2',
      doctorName: 'Dr. Michael Chen',
      date: '2026-07-28',
      diagnosis: 'Episodic Tension Migraine',
      prescription: 'Sumatriptan 50mg PRN. Magnesium Glycinate 400mg daily.',
      vitals: { bp: '118/76 mmHg', pulse: '68 bpm', temp: '98.4 °F', weight: '62 kg' },
      allergies: 'None reported',
      notes: 'Symptoms triggered by prolonged blue light screen time.'
    }
  ],

  feedback: [
    {
      id: 'fb_1',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Sarah Jenkins',
      patientName: 'Robert Taylor',
      rating: 5,
      comment: 'Dr. Jenkins was extremely thorough and explained my ECG results with great clarity. High recommended!',
      date: '2026-09-12'
    },
    {
      id: 'fb_2',
      doctorId: 'usr_doc_2',
      doctorName: 'Dr. Michael Chen',
      patientName: 'Emily Watson',
      rating: 5,
      comment: 'Very empathetic doctor who listens carefully to symptoms.',
      date: '2026-08-02'
    }
  ],

  systemSettings: {
    clinicName: 'MediCare Pulse Health Center',
    clinicEmail: 'contact@medicarepulse.org',
    clinicPhone: '+1 (800) 555-0199',
    operatingHoursStart: '08:00',
    operatingHoursEnd: '18:00',
    maxSlotCapacity: 4,
    emergencyContact: '+1 (800) 911-0000',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true,
    autoConfirmAppointments: true,
    currencySymbol: '$'
  },

  notifications: [
    {
      id: 'notif_1',
      title: 'New Appointment Booked',
      message: 'Alex Morgan booked Cardiology consultation for Sept 14.',
      time: '10 mins ago',
      read: false
    }
  ]
};

class Store {
  constructor() {
    this.listeners = [];
    this.loadState();
    this.initFirestoreListeners();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
      } else {
        this.state = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
        this.saveState();
      }
    } catch (err) {
      this.state = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (err) {
      console.error('Failed to write local state:', err);
    }
  }

  resetToSeed() {
    this.state = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(l => l(this.state));
  }

  // --- Realtime Cloud Firestore Listeners ---
  async initFirestoreListeners() {
    if (window.initFirebaseServices) {
      await window.initFirebaseServices();
    }

    if (window.fbDb && window.fbUtils) {
      const { collection, onSnapshot } = window.fbUtils;
      
      // Live listener for appointments collection
      onSnapshot(collection(window.fbDb, "appointments"), (snapshot) => {
        const cloudApts = [];
        snapshot.forEach((doc) => {
          cloudApts.push({ id: doc.id, ...doc.data() });
        });
        if (cloudApts.length > 0) {
          this.state.appointments = cloudApts;
          this.saveState();
        }
      });

      // Live listener for users collection
      onSnapshot(collection(window.fbDb, "users"), (snapshot) => {
        const cloudUsers = [];
        snapshot.forEach((doc) => {
          cloudUsers.push({ id: doc.id, ...doc.data() });
        });
        if (cloudUsers.length > 0) {
          this.state.users = cloudUsers;
          this.saveState();
        }
      });
    }
  }

  // --- Role & Current User Handling ---
  setRole(role) {
    this.state.currentRole = role;
    if (role === 'admin') {
      this.state.currentUser = this.state.users.find(u => u.role === 'admin') || this.state.users[0];
    } else if (role === 'doctor') {
      this.state.currentUser = this.state.users.find(u => u.role === 'doctor') || this.state.users[1];
    } else if (role === 'patient') {
      this.state.currentUser = this.state.users.find(u => u.role === 'patient') || this.state.users[4];
    }
    this.saveState();
  }

  // --- User Management CRUD ---
  getUsers(roleFilter = null, search = '') {
    return this.state.users.filter(u => {
      const matchRole = !roleFilter || roleFilter === 'all' || u.role === roleFilter;
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }

  addUser(userData) {
    const newUser = {
      id: userData.id || 'usr_' + Date.now(),
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      ...userData
    };
    this.state.users.push(newUser);
    this.addNotification(`User Created`, `Created new ${userData.role} account for ${userData.name}.`);

    // Sync to Cloud Firestore if ready
    if (window.fbDb && window.fbUtils) {
      window.fbUtils.setDoc(window.fbUtils.doc(window.fbDb, "users", newUser.id), newUser);
    }

    this.saveState();
    return newUser;
  }

  updateUser(id, updatedData) {
    const idx = this.state.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.state.users[idx] = { ...this.state.users[idx], ...updatedData };
      if (this.state.currentUser.id === id) {
        this.state.currentUser = { ...this.state.currentUser, ...updatedData };
      }

      if (window.fbDb && window.fbUtils) {
        window.fbUtils.updateDoc(window.fbUtils.doc(window.fbDb, "users", id), updatedData);
      }

      this.saveState();
      return true;
    }
    return false;
  }

  deleteUser(id) {
    const user = this.state.users.find(u => u.id === id);
    if (user) {
      this.state.users = this.state.users.filter(u => u.id !== id);
      this.addNotification('User Deleted', `Account for ${user.name} was removed.`);

      if (window.fbDb && window.fbUtils) {
        window.fbUtils.deleteDoc(window.fbUtils.doc(window.fbDb, "users", id));
      }

      this.saveState();
      return true;
    }
    return false;
  }

  // --- Appointment CRUD ---
  getAppointments(filters = {}) {
    return this.state.appointments.filter(apt => {
      if (filters.doctorId && apt.doctorId !== filters.doctorId) return false;
      if (filters.patientId && apt.patientId !== filters.patientId) return false;
      if (filters.status && filters.status !== 'all' && apt.status !== filters.status) return false;
      if (filters.date && apt.date !== filters.date) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return apt.patientName.toLowerCase().includes(q) || apt.doctorName.toLowerCase().includes(q) || apt.department.toLowerCase().includes(q);
      }
      return true;
    });
  }

  bookAppointment(aptData) {
    const doctor = this.state.users.find(u => u.id === aptData.doctorId);
    const patient = this.state.users.find(u => u.id === aptData.patientId) || this.state.currentUser;

    const newApt = {
      id: 'apt_' + Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName: doctor ? doctor.name : 'Unassigned Doctor',
      department: doctor ? doctor.department : 'General Medicine',
      status: this.state.systemSettings.autoConfirmAppointments ? 'Confirmed' : 'Pending',
      notes: '',
      ...aptData
    };

    this.state.appointments.unshift(newApt);
    this.addNotification('Appointment Booked', `Appointment confirmed for ${newApt.patientName} with ${newApt.doctorName}.`);

    if (window.fbDb && window.fbUtils) {
      window.fbUtils.setDoc(window.fbUtils.doc(window.fbDb, "appointments", newApt.id), newApt);
    }

    this.saveState();
    return newApt;
  }

  updateAppointmentStatus(id, newStatus, doctorNotes = '') {
    const apt = this.state.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = newStatus;
      if (doctorNotes) apt.notes = doctorNotes;
      
      if (window.fbDb && window.fbUtils) {
        window.fbUtils.updateDoc(window.fbUtils.doc(window.fbDb, "appointments", id), { status: newStatus, notes: apt.notes });
      }

      this.addNotification('Appointment Updated', `Appointment status changed to ${newStatus}.`);
      this.saveState();
      return true;
    }
    return false;
  }

  rescheduleAppointment(id, newDate, newTime) {
    const apt = this.state.appointments.find(a => a.id === id);
    if (apt) {
      apt.date = newDate;
      apt.time = newTime;
      apt.status = 'Confirmed';

      if (window.fbDb && window.fbUtils) {
        window.fbUtils.updateDoc(window.fbUtils.doc(window.fbDb, "appointments", id), { date: newDate, time: newTime, status: 'Confirmed' });
      }

      this.addNotification('Appointment Rescheduled', `Rescheduled to ${newDate} at ${newTime}.`);
      this.saveState();
      return true;
    }
    return false;
  }

  // --- Medical History CRUD ---
  getMedicalRecords(patientId) {
    return this.state.medicalRecords.filter(r => r.patientId === patientId);
  }

  addMedicalRecord(recordData) {
    const patient = this.state.users.find(u => u.id === recordData.patientId);
    const newRecord = {
      id: 'rec_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      patientName: patient ? patient.name : 'Patient',
      doctorName: this.state.currentUser.name,
      doctorId: this.state.currentUser.id,
      ...recordData
    };
    this.state.medicalRecords.unshift(newRecord);

    if (window.fbDb && window.fbUtils) {
      window.fbUtils.setDoc(window.fbUtils.doc(window.fbDb, "medicalRecords", newRecord.id), newRecord);
    }

    this.addNotification('Medical Record Created', `New medical record added for ${newRecord.patientName}.`);
    this.saveState();
    return newRecord;
  }

  updateMedicalRecord(id, updatedData) {
    const idx = this.state.medicalRecords.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.state.medicalRecords[idx] = { ...this.state.medicalRecords[idx], ...updatedData };
      
      if (window.fbDb && window.fbUtils) {
        window.fbUtils.updateDoc(window.fbUtils.doc(window.fbDb, "medicalRecords", id), updatedData);
      }

      this.saveState();
      return true;
    }
    return false;
  }

  // --- Feedback CRUD ---
  getFeedback(doctorId = null) {
    if (doctorId) {
      return this.state.feedback.filter(f => f.doctorId === doctorId);
    }
    return this.state.feedback;
  }

  addFeedback(feedbackData) {
    const newFeedback = {
      id: 'fb_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      patientName: this.state.currentUser.name,
      ...feedbackData
    };
    this.state.feedback.unshift(newFeedback);

    if (window.fbDb && window.fbUtils) {
      window.fbUtils.setDoc(window.fbUtils.doc(window.fbDb, "feedback", newFeedback.id), newFeedback);
    }

    this.saveState();
    return newFeedback;
  }

  // --- System Settings ---
  getSystemSettings() {
    return this.state.systemSettings;
  }

  updateSystemSettings(newSettings) {
    this.state.systemSettings = { ...this.state.systemSettings, ...newSettings };
    
    if (window.fbDb && window.fbUtils) {
      window.fbUtils.setDoc(window.fbUtils.doc(window.fbDb, "systemSettings", "config"), this.state.systemSettings);
    }

    this.addNotification('System Settings Updated', 'System-wide configurations updated successfully.');
    this.saveState();
    return true;
  }

  // --- Notifications Helper ---
  addNotification(title, message) {
    this.state.notifications.unshift({
      id: 'notif_' + Date.now(),
      title,
      message,
      time: 'Just now',
      read: false
    });
  }

  markNotificationsRead() {
    this.state.notifications.forEach(n => n.read = true);
    this.saveState();
  }

  // --- Analytics Helper ---
  getAnalyticsSummary() {
    const totalPatients = this.state.users.filter(u => u.role === 'patient').length;
    const totalDoctors = this.state.users.filter(u => u.role === 'doctor').length;
    const totalAppointments = this.state.appointments.length;
    const pendingAppointments = this.state.appointments.filter(a => a.status === 'Pending').length;
    const completedAppointments = this.state.appointments.filter(a => a.status === 'Completed').length;
    
    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      revenueEst: totalAppointments * 120,
      satisfactionRate: '98.5%'
    };
  }
}

window.appStore = new Store();
