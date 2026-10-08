import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080';

function App() {
  // =========================================================
  // AUTH
  // =========================================================

  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  const [currentPage, setCurrentPage] =
    useState('dashboard');

  const [email, setEmail] =
    useState('admin@apexcare.com');

  const [password, setPassword] =
    useState('Admin@123');

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [loginError, setLoginError] =
    useState('');

  // =========================================================
  // DASHBOARD
  // =========================================================

  const [dashboard, setDashboard] =
    useState(null);

  const [dashboardLoading, setDashboardLoading] =
    useState(false);

  // =========================================================
  // DOCTORS
  // =========================================================

  const [doctors, setDoctors] =
    useState([]);

  const [doctorsLoading, setDoctorsLoading] =
    useState(false);
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formSpecialization, setFormSpecialization] = useState('');
    const [formQualification, setFormQualification] = useState('');
    const [formLicenseNumber, setFormLicenseNumber] = useState('');
    const [formDepartmentId, setFormDepartmentId] = useState('');
    const [formExperience, setFormExperience] = useState('');
    const [formConsultationFee, setFormConsultationFee] = useState('');
    const [formStatus, setFormStatus] = useState('ACTIVE');
    const [modalError, setModalError] = useState('');
    const [modalLoading, setModalLoading] = useState(false);


  // =========================================================
  // PATIENT ACTIONS
  // =========================================================
  const openAddPatientModal = () => { setPatientForm({name:'',email:'',phone:'',dateOfBirth:'',gender:'MALE',bloodGroup:'O+',address:'',emergencyContact:''}); setPatientModalError(''); setShowPatientModal(true); };
  const closePatientModal = () => { if(patientModalLoading)return; setShowPatientModal(false); setPatientModalError(''); };
  const handlePatientSubmit = async (e) => {
    e.preventDefault(); setPatientModalError('');
    if(!patientForm.name.trim()) return setPatientModalError('Patient name is required.');
    if(!patientForm.email.trim()) return setPatientModalError('Email is required.');
    if(!patientForm.phone.trim()) return setPatientModalError('Phone is required.');
    if(!patientForm.dateOfBirth) return setPatientModalError('Date of birth is required.');
    setPatientModalLoading(true);
    try { await axios.post(`${API_URL}/api/patients`,patientForm,authHeaders()); setShowPatientModal(false); await loadPatients(); await loadDashboard(); }
    catch(error){ console.error(error); setPatientModalError(error.response?.data?.message||error.response?.data?.error||'Unable to create patient.'); }
    finally{ setPatientModalLoading(false); }
  };

  // =========================================================
  // APPOINTMENT ACTIONS
  // =========================================================
  const openAppointmentModal = async () => { setAppointmentForm({patientId:'',doctorId:'',appointmentDate:'',appointmentTime:'',reason:''}); setAppointmentModalError(''); setShowAppointmentModal(true); if(!patients.length) await loadPatients(); if(!doctors.length) await loadDoctors(); };
  const closeAppointmentModal = () => { if(appointmentModalLoading)return; setShowAppointmentModal(false); setAppointmentModalError(''); };
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault(); setAppointmentModalError('');
    if(!appointmentForm.patientId)return setAppointmentModalError('Please select a patient.');
    if(!appointmentForm.doctorId)return setAppointmentModalError('Please select a doctor.');
    if(!appointmentForm.appointmentDate)return setAppointmentModalError('Appointment date is required.');
    if(!appointmentForm.appointmentTime)return setAppointmentModalError('Appointment time is required.');
    if(!appointmentForm.reason.trim())return setAppointmentModalError('Reason is required.');
    setAppointmentModalLoading(true);
    try { await axios.post(`${API_URL}/api/appointments`,{patientId:Number(appointmentForm.patientId),doctorId:Number(appointmentForm.doctorId),appointmentDate:appointmentForm.appointmentDate,appointmentTime:appointmentForm.appointmentTime,reason:appointmentForm.reason.trim()},authHeaders()); setShowAppointmentModal(false); await loadAppointments(); await loadDashboard(); }
    catch(error){ console.error(error); setAppointmentModalError(error.response?.data?.message||error.response?.data?.error||'Unable to create appointment.'); }
    finally{ setAppointmentModalLoading(false); }
  };

  // =========================================================
  // DEPARTMENT ACTIONS
  // =========================================================
  const openAddDepartmentModal = () => { setDepartmentForm({name:'',description:'',status:'ACTIVE'}); setDepartmentModalError(''); setShowDepartmentModal(true); };
  const closeDepartmentModal = () => { if(departmentModalLoading)return; setShowDepartmentModal(false); setDepartmentModalError(''); };
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault(); setDepartmentModalError('');
    if(!departmentForm.name.trim())return setDepartmentModalError('Department name is required.');
    setDepartmentModalLoading(true);
    try { await axios.post(`${API_URL}/api/departments`,{name:departmentForm.name.trim(),description:departmentForm.description.trim(),status:departmentForm.status},authHeaders()); setShowDepartmentModal(false); await loadDepartments(); await loadDashboard(); }
    catch(error){ console.error(error); setDepartmentModalError(error.response?.data?.message||error.response?.data?.error||'Unable to create department.'); }
    finally{ setDepartmentModalLoading(false); }
  };

  // =========================================================
  // PATIENTS
  // =========================================================

  const [patients, setPatients] =
    useState([]);

  const [patientsLoading, setPatientsLoading] =
    useState(false);

  // =========================================================
  // APPOINTMENTS
  // =========================================================

  const [appointments, setAppointments] =
    useState([]);

  const [appointmentsLoading, setAppointmentsLoading] =
    useState(false);

  // =========================================================
  // DEPARTMENTS
  // =========================================================

  const [departments, setDepartments] =
    useState([]);

  const [departmentsLoading, setDepartmentsLoading] =
    useState(false);

  // =========================================================
  // BILLING
  // =========================================================

  const [bills, setBills] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [billingLoading, setBillingLoading] =
    useState(false);

  // =========================================================
  // PRESCRIPTIONS
  // =========================================================

  const [prescriptions, setPrescriptions] =
    useState([]);

  const [prescriptionsLoading, setPrescriptionsLoading] =
    useState(false);

  // =========================================================
  // MEDICAL RECORDS
  // =========================================================

  const [medicalRecords, setMedicalRecords] =
    useState([]);

  const [medicalRecordsLoading, setMedicalRecordsLoading] =
    useState(false);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notifications, setNotifications] =
    useState([]);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  // =========================================================
  // PATIENT / APPOINTMENT / DEPARTMENT ACTIONS
  // =========================================================
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientForm, setPatientForm] = useState({ name:'', email:'', phone:'', dateOfBirth:'', gender:'MALE', bloodGroup:'O+', address:'', emergencyContact:'' });
  const [patientModalError, setPatientModalError] = useState('');
  const [patientModalLoading, setPatientModalLoading] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ patientId:'', doctorId:'', appointmentDate:'', appointmentTime:'', reason:'' });
  const [appointmentModalError, setAppointmentModalError] = useState('');
  const [appointmentModalLoading, setAppointmentModalLoading] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({ name:'', description:'', status:'ACTIVE' });
  const [departmentModalError, setDepartmentModalError] = useState('');
  const [departmentModalLoading, setDepartmentModalLoading] = useState(false);

  // =========================================================
  // COMMON API HELPER
  // =========================================================

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem('token')
      }`
    }
  });

  /*
   * Some backend controllers may use slightly different
   * collection paths. This helper tries the supplied paths
   * in order and returns the first successful response.
   */
  const getFromPossibleEndpoints = async (paths) => {
    let lastError = null;

    for (const path of paths) {
      try {
        const response = await axios.get(
          `${API_URL}${path}`,
          authHeaders()
        );

        return response.data;

      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password
        }
      );

      const receivedToken =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.jwt;

      if (!receivedToken) {
        throw new Error(
          'JWT token was not returned by server'
        );
      }

      localStorage.setItem(
        'token',
        receivedToken
      );

      setToken(receivedToken);
      setCurrentPage('dashboard');

    } catch (error) {
      console.error(
        'Login failed:',
        error
      );

      setLoginError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Invalid email or password'
      );

    } finally {
      setLoginLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem('token');

    setToken(null);

    setDashboard(null);
    setDoctors([]);
    setPatients([]);
    setAppointments([]);
    setDepartments([]);
    setBills([]);
    setPayments([]);
    setPrescriptions([]);
    setMedicalRecords([]);
    setNotifications([]);

    setCurrentPage('dashboard');
  };

  // =========================================================
  // DASHBOARD
  // =========================================================

  const loadDashboard = async () => {
    const currentToken =
      localStorage.getItem('token');

    if (!currentToken) return;

    setDashboardLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/admin`,
        {
          headers: {
            Authorization:
              `Bearer ${currentToken}`
          }
        }
      );

      setDashboard(response.data);

    } catch (error) {
      console.error(
        'Dashboard loading failed:',
        error
      );

      if (
        error.response?.status === 401
      ) {
        handleLogout();
      }

    } finally {
      setDashboardLoading(false);
    }
  };

  // =========================================================
  // DOCTORS
  // =========================================================

  const loadDoctors = async () => {
    setDoctorsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/doctors`,
        authHeaders()
      );

      setDoctors(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        'Doctors loading failed:',
        error
      );

    } finally {
      setDoctorsLoading(false);
    }
  };

  // =========================================================
  // DOCTOR CRUD
  // =========================================================

  const resetDoctorForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSpecialization('');
    setFormQualification('');
    setFormLicenseNumber('');
    setFormDepartmentId('');
    setFormExperience('');
    setFormConsultationFee('');
    setFormStatus('ACTIVE');
    setEditingDoctorId(null);
    setIsEditMode(false);
    setModalError('');
  };

  const openAddDoctorModal = async () => {
    console.log('NEW DOCTOR BUTTON CLICKED');
    resetDoctorForm();
    setShowDoctorModal(true);

    if (departments.length === 0) {
      await loadDepartments();
    }
  };

  const openEditDoctorModal = async (doctor) => {
    setIsEditMode(true);
    setEditingDoctorId(doctor.id);
    setFormName(doctor.name || '');
    setFormEmail(doctor.email || '');
    setFormPhone(doctor.phone || '');
    setFormSpecialization(doctor.specialization || '');
    setFormQualification(doctor.qualification || '');
    setFormLicenseNumber(doctor.licenseNumber || '');
    setFormDepartmentId(
      doctor.departmentId ??
      doctor.department?.id ??
      ''
    );
    setFormExperience(
      doctor.experience !== undefined &&
      doctor.experience !== null
        ? String(doctor.experience)
        : ''
    );
    setFormConsultationFee(
      doctor.consultationFee !== undefined &&
      doctor.consultationFee !== null
        ? String(doctor.consultationFee)
        : ''
    );
    setFormStatus(doctor.status || 'ACTIVE');
    setModalError('');
    setShowDoctorModal(true);

    if (departments.length === 0) {
      await loadDepartments();
    }
  };

  const closeDoctorModal = () => {
    if (modalLoading) return;
    setShowDoctorModal(false);
    resetDoctorForm();
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formName.trim()) {
      setModalError('Doctor name is required.');
      return;
    }

    if (!formEmail.trim()) {
      setModalError('Email is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      setModalError('Enter a valid email address.');
      return;
    }

    if (!formSpecialization.trim()) {
      setModalError('Specialization is required.');
      return;
    }

    if (!formDepartmentId) {
      setModalError('Please select a department.');
      return;
    }

    if (formExperience === '' || Number(formExperience) < 0) {
      setModalError('Enter a valid experience.');
      return;
    }

    if (
      formConsultationFee === '' ||
      Number(formConsultationFee) <= 0
    ) {
      setModalError('Consultation fee must be greater than 0.');
      return;
    }

    const payload = {
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || null,
      specialization: formSpecialization.trim(),
      qualification: formQualification.trim() || null,
      licenseNumber: formLicenseNumber.trim() || null,
      departmentId: Number(formDepartmentId),
      experience: Number(formExperience),
      consultationFee: Number(formConsultationFee),
      status: formStatus
    };

    setModalLoading(true);

    try {
      if (isEditMode) {
        await axios.put(
          `${API_URL}/api/doctors/${editingDoctorId}`,
          payload,
          authHeaders()
        );
      } else {
        await axios.post(
          `${API_URL}/api/doctors`,
          payload,
          authHeaders()
        );
      }

      setShowDoctorModal(false);
      resetDoctorForm();
      await loadDoctors();

    } catch (error) {
      console.error('Doctor save failed:', error);

      setModalError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Unable to ${isEditMode ? 'update' : 'create'} doctor.`
      );

    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/doctors/${doctor.id}`,
        authHeaders()
      );

      await loadDoctors();

    } catch (error) {
      console.error('Doctor delete failed:', error);

      window.alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to delete doctor.'
      );
    }
  };

  // =========================================================
  // PATIENTS
  // =========================================================

  const loadPatients = async () => {
    setPatientsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/patients`,
        authHeaders()
      );

      setPatients(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        'Patients loading failed:',
        error
      );

    } finally {
      setPatientsLoading(false);
    }
  };

  // =========================================================
  // APPOINTMENTS
  // =========================================================

  const loadAppointments = async () => {
    setAppointmentsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/appointments`,
        authHeaders()
      );

      setAppointments(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        'Appointments loading failed:',
        error
      );

    } finally {
      setAppointmentsLoading(false);
    }
  };

  // =========================================================
  // DEPARTMENTS
  // =========================================================

  const loadDepartments = async () => {
    setDepartmentsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/departments`,
        authHeaders()
      );

      setDepartments(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        'Departments loading failed:',
        error
      );

    } finally {
      setDepartmentsLoading(false);
    }
  };

  // =========================================================
  // BILLING
  // =========================================================

  const loadBilling = async () => {
    setBillingLoading(true);

    try {
      const data =
        await getFromPossibleEndpoints([
          '/api/billing',
          '/api/bills'
        ]);

      const billData =
        Array.isArray(data)
          ? data
          : data?.content ||
            data?.bills ||
            [];

      setBills(billData);

    } catch (error) {
      console.error(
        'Billing loading failed:',
        error
      );

      setBills([]);

    } finally {
      setBillingLoading(false);
    }

    // Payments are loaded separately because
    // billing and payments are separate backend modules.
    try {
      const data =
        await getFromPossibleEndpoints([
          '/api/payments'
        ]);

      const paymentData =
        Array.isArray(data)
          ? data
          : data?.content ||
            data?.payments ||
            [];

      setPayments(paymentData);

    } catch (error) {
      console.error(
        'Payments loading failed:',
        error
      );

      setPayments([]);
    }
  };

  // =========================================================
  // PRESCRIPTIONS
  // =========================================================

  const loadPrescriptions = async () => {
    setPrescriptionsLoading(true);

    try {
      const data =
        await getFromPossibleEndpoints([
          '/api/prescriptions'
        ]);

      const prescriptionData =
        Array.isArray(data)
          ? data
          : data?.content ||
            data?.prescriptions ||
            [];

      setPrescriptions(
        prescriptionData
      );

    } catch (error) {
      console.error(
        'Prescriptions loading failed:',
        error
      );

      setPrescriptions([]);

    } finally {
      setPrescriptionsLoading(false);
    }
  };

  // =========================================================
  // MEDICAL RECORDS
  // =========================================================

  const loadMedicalRecords = async () => {
    setMedicalRecordsLoading(true);

    try {
      const data =
        await getFromPossibleEndpoints([
          '/api/medical-records',
          '/api/medicalRecords',
          '/api/records'
        ]);

      const recordData =
        Array.isArray(data)
          ? data
          : data?.content ||
            data?.medicalRecords ||
            data?.records ||
            [];

      setMedicalRecords(recordData);

    } catch (error) {
      console.error(
        'Medical records loading failed:',
        error
      );

      setMedicalRecords([]);

    } finally {
      setMedicalRecordsLoading(false);
    }
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const loadNotifications = async () => {
    setNotificationsLoading(true);

    try {
      const data =
        await getFromPossibleEndpoints([
          '/api/notifications'
        ]);

      const notificationData =
        Array.isArray(data)
          ? data
          : data?.content ||
            data?.notifications ||
            [];

      setNotifications(
        notificationData
      );

    } catch (error) {
      console.error(
        'Notifications loading failed:',
        error
      );

      setNotifications([]);

    } finally {
      setNotificationsLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const openDashboard = () => {
    setCurrentPage('dashboard');
    loadDashboard();
  };

  const openDoctors = () => {
    setCurrentPage('doctors');
    loadDoctors();
  };

  const openPatients = () => {
    setCurrentPage('patients');
    loadPatients();
  };

  const openAppointments = () => {
    setCurrentPage('appointments');
    loadAppointments();
  };

  const openDepartments = () => {
    setCurrentPage('departments');
    loadDepartments();
  };

  const openBilling = () => {
    setCurrentPage('billing');
    loadBilling();
  };

  const openPrescriptions = () => {
    setCurrentPage('prescriptions');
    loadPrescriptions();
  };

  const openMedicalRecords = () => {
    setCurrentPage('medical-records');
    loadMedicalRecords();
  };

  const openNotifications = () => {
    setCurrentPage('notifications');
    loadNotifications();
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const formatMoney = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return '₹0';
    }

    const number =
      Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return `₹${number.toLocaleString(
      'en-IN'
    )}`;
  };

  const formatTime = (time) => {
    if (!time) return '-';

    const parts =
      String(time).split(':');

    if (parts.length < 2) {
      return time;
    }

    let hour =
      parseInt(parts[0], 10);

    const minute = parts[1];

    const ampm =
      hour >= 12 ? 'pm' : 'am';

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(
      2,
      '0'
    )}:${minute} ${ampm}`;
  };

  const getStatusClass = (status) => {
    if (!status) return '';

    return `status-${String(
      status
    ).toLowerCase()}`;
  };

  const value = (
    object,
    keys,
    fallback = '-'
  ) => {
    for (const key of keys) {
      if (
        object &&
        object[key] !== undefined &&
        object[key] !== null &&
        object[key] !== ''
      ) {
        return object[key];
      }
    }

    return fallback;
  };

  const displayValue = (
    object,
    keys,
    fallback = '-'
  ) => {
    const result =
      value(
        object,
        keys,
        fallback
      );

    if (
      typeof result === 'object'
    ) {
      return JSON.stringify(
        result
      );
    }

    return result;
  };

  // =========================================================
  // REUSABLE HEADER
  // =========================================================

  const PageHeader = ({
    title,
    subtitle
  }) => (
    <div className="header">

      <div>

        <h1>
          {title}
        </h1>

        <span>
          {subtitle}
        </span>

      </div>

      <span>
        👤 admin@apexcare.com
      </span>

    </div>
  );

  // =========================================================
  // LOGIN SCREEN
  // =========================================================

  if (!token) {
    return (
      <div className="login-container">

        <h1>
          ApexCare Hospital Management System
        </h1>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loginLoading}
          >
            {loginLoading
              ? 'Logging in...'
              : 'Login'}
          </button>

          {loginError && (
            <div className="error">
              {loginError}
            </div>
          )}

        </form>

      </div>
    );
  }

  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (
    <div className="app-container">

      {/* =================================================== */}
      {/* SIDEBAR                                             */}
      {/* =================================================== */}

      <aside className="sidebar">

        <div className="logo">
          ApexCare
        </div>

        <nav className="nav-menu">

          <ul>

            <li
              onClick={openDashboard}
              className={
                currentPage === 'dashboard'
                  ? 'active'
                  : ''
              }
            >
              Dashboard
            </li>

            <li
              onClick={openDoctors}
              className={
                currentPage === 'doctors'
                  ? 'active'
                  : ''
              }
            >
              Doctors
            </li>

            <li
              onClick={openPatients}
              className={
                currentPage === 'patients'
                  ? 'active'
                  : ''
              }
            >
              Patients
            </li>

            <li
              onClick={openAppointments}
              className={
                currentPage === 'appointments'
                  ? 'active'
                  : ''
              }
            >
              Appointments
            </li>

            <li
              onClick={openDepartments}
              className={
                currentPage === 'departments'
                  ? 'active'
                  : ''
              }
            >
              Departments
            </li>

            <li
              onClick={openBilling}
              className={
                currentPage === 'billing'
                  ? 'active'
                  : ''
              }
            >
              Billing
            </li>

            <li
              onClick={openPrescriptions}
              className={
                currentPage === 'prescriptions'
                  ? 'active'
                  : ''
              }
            >
              Prescriptions
            </li>

            <li
              onClick={openMedicalRecords}
              className={
                currentPage === 'medical-records'
                  ? 'active'
                  : ''
              }
            >
              Medical Records
            </li>

            <li
              onClick={openNotifications}
              className={
                currentPage === 'notifications'
                  ? 'active'
                  : ''
              }
            >
              Notifications
            </li>

            <li onClick={handleLogout}>
              Logout
            </li>

          </ul>

        </nav>

      </aside>

      {/* =================================================== */}
      {/* MAIN CONTENT                                        */}
      {/* =================================================== */}

      <main className="main-content">

        {/* ================================================= */}
        {/* DASHBOARD                                         */}
        {/* ================================================= */}

        {currentPage === 'dashboard' && (

          <>

            <PageHeader
              title="Admin Dashboard"
              subtitle="Welcome to ApexCare Hospital Management System"
            />

            {dashboardLoading &&
            !dashboard ? (

              <div className="appointments">

                <h3>
                  Loading dashboard...
                </h3>

              </div>

            ) : dashboard ? (

              <>

                {/* CARDS */}
                <div className="cards">

                  <div className="card">

                    Total Doctors

                    <strong>
                      {dashboard.totalDoctors}
                    </strong>

                  </div>

                  <div className="card">

                    Total Patients

                    <strong>
                      {dashboard.totalPatients}
                    </strong>

                  </div>

                  <div className="card">

                    Today's Appointments

                    <strong>
                      {dashboard.todayAppointments}
                    </strong>

                  </div>

                  <div className="card">

                    Total Revenue

                    <strong>
                      {formatMoney(
                        dashboard.totalRevenue
                      )}
                    </strong>

                  </div>

                </div>

                {/* APPOINTMENT STATISTICS */}
                <div className="appointments">

                  <h2>
                    Appointment Statistics
                  </h2>

                  <div className="stats-grid">

                    {dashboard.appointmentStats?.map(
                      (stat) => (

                        <div
                          className="stat-box"
                          key={stat.name}
                        >

                          <strong>
                            {stat.value}
                          </strong>

                          <span>
                            {stat.name}
                          </span>

                          <small>
                            {stat.value === 1
                              ? 'appointment'
                              : 'appointments'}
                          </small>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* RECENT APPOINTMENTS */}
                <div className="recent-patients">

                  <h2>
                    Recent Appointments
                  </h2>

                  <div className="table-wrapper">

                    <table>

                      <thead>

                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Department</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                        </tr>

                      </thead>

                      <tbody>

                        {dashboard.recentAppointments?.map(
                          (appointment) => (

                            <tr
                              key={appointment.id}
                            >

                              <td>
                                {
                                  appointment.patientName
                                }
                              </td>

                              <td>
                                {
                                  appointment.doctorName
                                }
                              </td>

                              <td>
                                {
                                  appointment.departmentName
                                }
                              </td>

                              <td>
                                {
                                  appointment.appointmentDate
                                }
                              </td>

                              <td>
                                {formatTime(
                                  appointment.appointmentTime
                                )}
                              </td>

                              <td>

                                <span
                                  className={`status-badge ${getStatusClass(
                                    appointment.status
                                  )}`}
                                >
                                  {
                                    appointment.status
                                  }
                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* QUICK ACTIONS */}
                <div className="quick-actions">

                  <h2>
                    Quick Actions
                  </h2>

                  <button
                    onClick={openAddDoctorModal}
                  >
                    + New Doctor
                  </button>

                  <button
                    onClick={openAddPatientModal}
                  >
                    + New Patient
                  </button>

                  <button
                    onClick={openAppointmentModal}
                  >
                    📅 Schedule Appointment
                  </button>

                  <button
                    onClick={openAddDepartmentModal}
                  >
                    🏥 Add Department
                  </button>

                </div>

                {/* DEPARTMENTS */}
                <div className="recent-patients">

                  <h2>
                    Departments
                  </h2>

                  <div className="table-wrapper">

                    <table>

                      <thead>

                        <tr>
                          <th>Department</th>
                          <th>Doctors</th>
                        </tr>

                      </thead>

                      <tbody>

                        {dashboard.departmentStats?.map(
                          (department) => (

                            <tr
                              key={
                                department.name
                              }
                            >

                              <td>
                                {
                                  department.name
                                }
                              </td>

                              <td>
                                {
                                  department.doctors
                                }
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* REVENUE */}
                <div className="appointments">

                  <h2>
                    Revenue Overview
                  </h2>

                  <div className="revenue-grid">

                    <div className="revenue-box">

                      <span>
                        Total Revenue
                      </span>

                      <small>
                        All recorded payments
                      </small>

                      <strong>
                        {formatMoney(
                          dashboard.totalRevenue
                        )}
                      </strong>

                    </div>

                    <div className="revenue-box">

                      <span>
                        Pending Revenue
                      </span>

                      <small>
                        Outstanding amount
                      </small>

                      <strong>
                        {formatMoney(
                          dashboard.pendingRevenue
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              </>

            ) : (

              <div className="appointments">

                <h3>
                  Unable to load dashboard.
                </h3>

              </div>

            )}

          </>

        )}

        {/* ================================================= */}
        {/* DOCTORS                                           */}
        {/* ================================================= */}

        {currentPage === 'doctors' && (

          <>

            <PageHeader
              title="Doctors"
              subtitle="Manage ApexCare hospital doctors"
            />

            <div className="recent-patients">

              <div className="doctor-page-header">
                <div>
                  <h2>
                    All Doctors
                  </h2>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={openAddDoctorModal}
                >
                  + New Doctor
                </button>
              </div>

              {doctorsLoading ? (

                <p>
                  Loading doctors...
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>
                        <th>Doctor</th>
                        <th>Code</th>
                        <th>Specialization</th>
                        <th>Department</th>
                        <th>Experience</th>
                        <th>Fee</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>

                    </thead>

                    <tbody>

                      {doctors.map(
                        (doctor) => (

                          <tr
                            key={doctor.id}
                          >

                            <td>
                              <strong>
                                {doctor.name}
                              </strong>
                            </td>

                            <td>
                              {
                                doctor.doctorCode
                              }
                            </td>

                            <td>
                              {
                                doctor.specialization
                              }
                            </td>

                            <td>
                              {
                                doctor.departmentName
                              }
                            </td>

                            <td>
                              {
                                doctor.experience
                              } years
                            </td>

                            <td>
                              {formatMoney(
                                doctor.consultationFee
                              )}
                            </td>

                            <td>

                              <span
                                className={`status-badge ${getStatusClass(
                                  doctor.status
                                )}`}
                              >
                                {
                                  doctor.status
                                }
                              </span>

                            </td>

                            <td>
                              <div className="doctor-actions">
                                <button
                                  type="button"
                                  className="btn-edit"
                                  onClick={() =>
                                    openEditDoctorModal(doctor)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="btn-delete"
                                  onClick={() =>
                                    handleDeleteDoctor(doctor)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            <div className="appointments">

              <h2>
                Doctor Availability
              </h2>

              <p>
                Doctors currently have
                availability configured for
                Monday to Friday.
              </p>

            </div>

          </>

        )}

        {/* ================================================= */}
        {/* PATIENTS                                          */}
        {/* ================================================= */}

        {currentPage === 'patients' && (

          <>

            <PageHeader
              title="Patients"
              subtitle="Manage ApexCare hospital patients"
            />

            <div className="recent-patients">

              <div className="doctor-page-header"><h2>All Patients</h2><button type="button" className="btn-primary" onClick={openAddPatientModal}>+ New Patient</button></div>

              {patientsLoading ? (

                <p>
                  Loading patients...
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>
                        <th>Patient</th>
                        <th>Code</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>Blood Group</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {patients.map(
                        (patient) => (

                          <tr
                            key={patient.id}
                          >

                            <td>
                              <strong>
                                {patient.name}
                              </strong>
                            </td>

                            <td>
                              {
                                patient.patientCode
                              }
                            </td>

                            <td>
                              {patient.gender}
                            </td>

                            <td>
                              {
                                patient.dateOfBirth
                              }
                            </td>

                            <td>
                              {
                                patient.bloodGroup
                              }
                            </td>

                            <td>
                              {patient.phone}
                            </td>

                            <td>

                              <span
                                className={`status-badge ${getStatusClass(
                                  patient.status
                                )}`}
                              >
                                {
                                  patient.status
                                }
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>

        )}

        {/* ================================================= */}
        {/* APPOINTMENTS                                      */}
        {/* ================================================= */}

        {currentPage === 'appointments' && (

          <>

            <PageHeader
              title="Appointments"
              subtitle="Manage ApexCare hospital appointments"
            />

            <div className="cards">

              <div className="card">
                Total Appointments
                <strong>
                  {appointments.length}
                </strong>
              </div>

              <div className="card">
                Pending
                <strong>
                  {
                    appointments.filter(
                      (a) =>
                        a.status ===
                        'PENDING'
                    ).length
                  }
                </strong>
              </div>

              <div className="card">
                Confirmed
                <strong>
                  {
                    appointments.filter(
                      (a) =>
                        a.status ===
                        'CONFIRMED'
                    ).length
                  }
                </strong>
              </div>

              <div className="card">
                Completed
                <strong>
                  {
                    appointments.filter(
                      (a) =>
                        a.status ===
                        'COMPLETED'
                    ).length
                  }
                </strong>
              </div>

            </div>

            <div className="recent-patients">

              <div className="doctor-page-header"><h2>All Appointments</h2><button type="button" className="btn-primary" onClick={openAppointmentModal}>+ Schedule Appointment</button></div>

              {appointmentsLoading ? (

                <p>
                  Loading appointments...
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Fee</th>
                        <th>Status</th>
                        <th>Consultation</th>
                        <th>Billing</th>
                      </tr>

                    </thead>

                    <tbody>

                      {appointments.map(
                        (appointment) => (

                          <tr
                            key={
                              appointment.id
                            }
                          >

                            <td>

                              <strong>
                                {
                                  appointment.patientName
                                }
                              </strong>

                              <br />

                              <small>
                                {
                                  appointment.patientCode
                                }
                              </small>

                            </td>

                            <td>

                              <strong>
                                {
                                  appointment.doctorName
                                }
                              </strong>

                              <br />

                              <small>
                                {
                                  appointment.specialization
                                }
                              </small>

                            </td>

                            <td>
                              {
                                appointment.departmentName
                              }
                            </td>

                            <td>
                              {
                                appointment.appointmentDate
                              }
                            </td>

                            <td>
                              {formatTime(
                                appointment.appointmentTime
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                appointment.consultationFee
                              )}
                            </td>

                            <td>

                              <span
                                className={`status-badge ${getStatusClass(
                                  appointment.status
                                )}`}
                              >
                                {
                                  appointment.status
                                }
                              </span>

                            </td>

                            <td>

                              {appointment.hasConsultation ? (

                                <span className="success-text">
                                  ✓ Completed
                                </span>

                              ) : (

                                <span className="muted-text">
                                  Not completed
                                </span>

                              )}

                            </td>

                            <td>

                              {appointment.hasBill ? (

                                <span className="success-text">
                                  ✓ Billed
                                </span>

                              ) : (

                                <span className="muted-text">
                                  Not billed
                                </span>

                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            <div className="appointments">

              <h2>
                Appointment Reasons
              </h2>

              {appointments.map(
                (appointment) => (

                  <div
                    key={
                      appointment.id
                    }
                    className="appointment-reason"
                  >

                    <strong>
                      #{appointment.id}
                      {' — '}
                      {
                        appointment.patientName
                      }
                    </strong>

                    <span>
                      {appointment.reason}
                    </span>

                  </div>

                )
              )}

            </div>

          </>

        )}

        {/* ================================================= */}
        {/* DEPARTMENTS                                       */}
        {/* ================================================= */}

        {currentPage === 'departments' && (

          <>

            <PageHeader
              title="Departments"
              subtitle="Manage ApexCare hospital departments"
            />

            <div className="cards">

              <div className="card">
                Total Departments
                <strong>
                  {departments.length}
                </strong>
              </div>

              <div className="card">
                Active Departments
                <strong>
                  {
                    departments.filter(
                      (d) =>
                        !d.status ||
                        d.status ===
                          'ACTIVE'
                    ).length
                  }
                </strong>
              </div>

              <div className="card">
                Total Doctors
                <strong>
                  {
                    dashboard?.totalDoctors ||
                    0
                  }
                </strong>
              </div>

              <div className="card">
                Departments With Doctors
                <strong>
                  {
                    dashboard?.departmentStats?.filter(
                      (d) =>
                        d.doctors > 0
                    ).length || 0
                  }
                </strong>
              </div>

            </div>

            <div className="recent-patients">

              <div className="doctor-page-header"><h2>All Departments</h2><button type="button" className="btn-primary" onClick={openAddDepartmentModal}>+ New Department</button></div>

              {departmentsLoading ? (

                <p>
                  Loading departments...
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>
                        <th>Department</th>
                        <th>Description</th>
                        <th>Doctors</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {departments.map(
                        (department) => {

                          const stats =
                            dashboard?.departmentStats?.find(
                              (item) =>
                                item.name ===
                                department.name
                            );

                          return (

                            <tr
                              key={
                                department.id
                              }
                            >

                              <td>
                                <strong>
                                  {
                                    department.name
                                  }
                                </strong>
                              </td>

                              <td>
                                {
                                  department.description ||
                                  '-'
                                }
                              </td>

                              <td>
                                {
                                  stats?.doctors ||
                                  0
                                }
                              </td>

                              <td>

                                <span
                                  className={`status-badge ${
                                    department.status
                                      ? getStatusClass(
                                          department.status
                                        )
                                      : 'status-active'
                                  }`}
                                >
                                  {
                                    department.status ||
                                    'ACTIVE'
                                  }
                                </span>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>

        )}

        {/* ================================================= */}
        {/* BILLING                                           */}
        {/* ================================================= */}

        {currentPage === 'billing' && (

          <>

            <PageHeader
              title="Billing & Payments"
              subtitle="Manage hospital bills and payments"
            />

            {/* BILLING SUMMARY */}
            <div className="cards">

              <div className="card">

                Total Bills

                <strong>
                  {bills.length}
                </strong>

              </div>

              <div className="card">

                Total Payments

                <strong>
                  {payments.length}
                </strong>

              </div>

              <div className="card">

                Total Billed

                <strong>
                  {formatMoney(
                    bills.reduce(
                      (sum, bill) =>
                        sum +
                        Number(
                          value(
                            bill,
                            [
                              'totalAmount',
                              'total',
                              'amount',
                              'grandTotal'
                            ],
                            0
                          )
                        ),
                      0
                    )
                  )}
                </strong>

              </div>

              <div className="card">

                Total Paid

                <strong>
                  {formatMoney(
                    payments.reduce(
                      (sum, payment) =>
                        sum +
                        Number(
                          value(
                            payment,
                            [
                              'amount',
                              'paymentAmount',
                              'paidAmount'
                            ],
                            0
                          )
                        ),
                      0
                    )
                  )}
                </strong>

              </div>

            </div>

            {/* BILLS */}
            <div className="recent-patients">

              <h2>
                Hospital Bills
              </h2>

              {billingLoading ? (

                <p>
                  Loading billing data...
                </p>

              ) : bills.length === 0 ? (

                <p>
                  No bills found.
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Bill
                        </th>

                        <th>
                          Patient
                        </th>

                        <th>
                          Appointment
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Paid
                        </th>

                        <th>
                          Balance
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {bills.map(
                        (bill, index) => {

                          const total =
                            Number(
                              value(
                                bill,
                                [
                                  'totalAmount',
                                  'total',
                                  'amount',
                                  'grandTotal'
                                ],
                                0
                              )
                            );

                          const paid =
                            Number(
                              value(
                                bill,
                                [
                                  'paidAmount',
                                  'amountPaid',
                                  'paid'
                                ],
                                0
                              )
                            );

                          const balance =
                            Math.max(
                              total - paid,
                              0
                            );

                          return (

                            <tr
                              key={
                                bill.id ||
                                index
                              }
                            >

                              <td>
                                <strong>
                                  {
                                    value(
                                      bill,
                                      [
                                        'billNumber',
                                        'billCode',
                                        'invoiceNumber',
                                        'id'
                                      ]
                                    )
                                  }
                                </strong>
                              </td>

                              <td>
                                {
                                  value(
                                    bill,
                                    [
                                      'patientName',
                                      'patient'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {
                                  value(
                                    bill,
                                    [
                                      'appointmentId',
                                      'appointmentCode'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {formatMoney(
                                  total
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  paid
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  balance
                                )}
                              </td>

                              <td>

                                <span
                                  className={`status-badge ${getStatusClass(
                                    value(
                                      bill,
                                      [
                                        'status',
                                        'paymentStatus'
                                      ],
                                      balance > 0
                                        ? 'PENDING'
                                        : 'PAID'
                                    )
                                  )}`}
                                >
                                  {
                                    value(
                                      bill,
                                      [
                                        'status',
                                        'paymentStatus'
                                      ],
                                      balance > 0
                                        ? 'PENDING'
                                        : 'PAID'
                                    )
                                  }
                                </span>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* PAYMENTS */}
            <div className="recent-patients">

              <h2>
                Payment History
              </h2>

              {payments.length === 0 ? (

                <p>
                  No payment records found.
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Payment
                        </th>

                        <th>
                          Patient
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Method
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {payments.map(
                        (payment, index) => (

                          <tr
                            key={
                              payment.id ||
                              index
                            }
                          >

                            <td>
                              {
                                value(
                                  payment,
                                  [
                                    'paymentNumber',
                                    'transactionId',
                                    'id'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {
                                value(
                                  payment,
                                  [
                                    'patientName',
                                    'patient'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {formatMoney(
                                value(
                                  payment,
                                  [
                                    'amount',
                                    'paymentAmount',
                                    'paidAmount'
                                  ],
                                  0
                                )
                              )}
                            </td>

                            <td>
                              {
                                value(
                                  payment,
                                  [
                                    'paymentMethod',
                                    'method',
                                    'mode'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {
                                value(
                                  payment,
                                  [
                                    'paymentDate',
                                    'paidAt',
                                    'createdAt',
                                    'date'
                                  ]
                                )
                              }
                            </td>

                            <td>

                              <span
                                className={`status-badge ${getStatusClass(
                                  value(
                                    payment,
                                    [
                                      'status',
                                      'paymentStatus'
                                    ],
                                    'PAID'
                                  )
                                )}`}
                              >
                                {
                                  value(
                                    payment,
                                    [
                                      'status',
                                      'paymentStatus'
                                    ],
                                    'PAID'
                                  )
                                }
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>

        )}

        {/* ================================================= */}
        {/* PRESCRIPTIONS                                     */}
        {/* ================================================= */}

        {currentPage === 'prescriptions' && (

          <>

            <PageHeader
              title="Prescriptions"
              subtitle="Manage patient prescriptions"
            />

            <div className="cards">

              <div className="card">

                Total Prescriptions

                <strong>
                  {prescriptions.length}
                </strong>

              </div>

              <div className="card">

                Patients With Prescriptions

                <strong>
                  {
                    new Set(
                      prescriptions.map(
                        (p) =>
                          value(
                            p,
                            [
                              'patientId',
                              'patientName'
                            ],
                            Math.random()
                          )
                      )
                    ).size
                  }
                </strong>

              </div>

              <div className="card">

                Doctors

                <strong>
                  {
                    new Set(
                      prescriptions.map(
                        (p) =>
                          value(
                            p,
                            [
                              'doctorId',
                              'doctorName'
                            ],
                            Math.random()
                          )
                      )
                    ).size
                  }
                </strong>

              </div>

              <div className="card">

                Status

                <strong>
                  ACTIVE
                </strong>

              </div>

            </div>

            <div className="recent-patients">

              <h2>
                Prescription Records
              </h2>

              {prescriptionsLoading ? (

                <p>
                  Loading prescriptions...
                </p>

              ) : prescriptions.length === 0 ? (

                <p>
                  No prescription records found.
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Prescription
                        </th>

                        <th>
                          Patient
                        </th>

                        <th>
                          Doctor
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Diagnosis
                        </th>

                        <th>
                          Medicines
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {prescriptions.map(
                        (prescription, index) => {

                          const items =
                            prescription.items ||
                            prescription.prescriptionItems ||
                            prescription.medicines ||
                            [];

                          return (

                            <tr
                              key={
                                prescription.id ||
                                index
                              }
                            >

                              <td>
                                <strong>
                                  {
                                    value(
                                      prescription,
                                      [
                                        'prescriptionNumber',
                                        'prescriptionCode',
                                        'id'
                                      ]
                                    )
                                  }
                                </strong>
                              </td>

                              <td>
                                {
                                  value(
                                    prescription,
                                    [
                                      'patientName',
                                      'patient'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {
                                  value(
                                    prescription,
                                    [
                                      'doctorName',
                                      'doctor'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {
                                  value(
                                    prescription,
                                    [
                                      'prescriptionDate',
                                      'date',
                                      'createdAt'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {
                                  value(
                                    prescription,
                                    [
                                      'diagnosis',
                                      'diagnoses',
                                      'condition'
                                    ]
                                  )
                                }
                              </td>

                              <td>

                                {Array.isArray(
                                  items
                                )
                                  ? items.length
                                  : value(
                                      prescription,
                                      [
                                        'medicineName',
                                        'medication'
                                      ]
                                    )}

                              </td>

                              <td>

                                <span
                                  className={`status-badge ${getStatusClass(
                                    value(
                                      prescription,
                                      [
                                        'status'
                                      ],
                                      'ACTIVE'
                                    )
                                  )}`}
                                >
                                  {
                                    value(
                                      prescription,
                                      [
                                        'status'
                                      ],
                                      'ACTIVE'
                                    )
                                  }
                                </span>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* MEDICINE DETAILS */}
            {prescriptions.length > 0 && (

              <div className="appointments">

                <h2>
                  Prescription Details
                </h2>

                {prescriptions.map(
                  (prescription, index) => {

                    const items =
                      prescription.items ||
                      prescription.prescriptionItems ||
                      prescription.medicines ||
                      [];

                    return (

                      <div
                        key={
                          prescription.id ||
                          index
                        }
                        className="appointment-reason"
                      >

                        <strong>
                          {
                            value(
                              prescription,
                              [
                                'patientName',
                                'patient'
                              ],
                              'Patient'
                            )
                          }
                        </strong>

                        <span>

                          {
                            Array.isArray(
                              items
                            ) && items.length > 0
                              ? items
                                  .map(
                                    (item) =>
                                      value(
                                        item,
                                        [
                                          'medicineName',
                                          'medicationName',
                                          'name'
                                        ],
                                        'Medicine'
                                      )
                                  )
                                  .join(', ')
                              : value(
                                  prescription,
                                  [
                                    'medicineName',
                                    'medication'
                                  ],
                                  'Prescription recorded'
                                )
                          }

                        </span>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </>

        )}

        {/* ================================================= */}
        {/* MEDICAL RECORDS                                   */}
        {/* ================================================= */}

        {currentPage === 'medical-records' && (

          <>

            <PageHeader
              title="Medical Records"
              subtitle="Manage patient medical records"
            />

            <div className="cards">

              <div className="card">

                Total Records

                <strong>
                  {medicalRecords.length}
                </strong>

              </div>

              <div className="card">

                Patients

                <strong>
                  {
                    new Set(
                      medicalRecords.map(
                        (record) =>
                          value(
                            record,
                            [
                              'patientId',
                              'patientName'
                            ],
                            Math.random()
                          )
                      )
                    ).size
                  }
                </strong>

              </div>

              <div className="card">

                Doctors

                <strong>
                  {
                    new Set(
                      medicalRecords.map(
                        (record) =>
                          value(
                            record,
                            [
                              'doctorId',
                              'doctorName'
                            ],
                            Math.random()
                          )
                      )
                    ).size
                  }
                </strong>

              </div>

              <div className="card">

                Records System

                <strong>
                  ACTIVE
                </strong>

              </div>

            </div>

            <div className="recent-patients">

              <h2>
                Patient Medical Records
              </h2>

              {medicalRecordsLoading ? (

                <p>
                  Loading medical records...
                </p>

              ) : medicalRecords.length === 0 ? (

                <p>
                  No medical records found.
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Record
                        </th>

                        <th>
                          Patient
                        </th>

                        <th>
                          Doctor
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Diagnosis
                        </th>

                        <th>
                          Treatment
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {medicalRecords.map(
                        (record, index) => (

                          <tr
                            key={
                              record.id ||
                              index
                            }
                          >

                            <td>
                              <strong>
                                {
                                  value(
                                    record,
                                    [
                                      'recordNumber',
                                      'recordCode',
                                      'id'
                                    ]
                                  )
                                }
                              </strong>
                            </td>

                            <td>
                              {
                                value(
                                  record,
                                  [
                                    'patientName',
                                    'patient'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {
                                value(
                                  record,
                                  [
                                    'doctorName',
                                    'doctor'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {
                                value(
                                  record,
                                  [
                                    'recordDate',
                                    'date',
                                    'createdAt'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {
                                value(
                                  record,
                                  [
                                    'diagnosis',
                                    'diagnoses'
                                  ]
                                )
                              }
                            </td>

                            <td>
                              {
                                value(
                                  record,
                                  [
                                    'treatment',
                                    'treatmentPlan',
                                    'description'
                                  ]
                                )
                              }
                            </td>

                            <td>

                              <span
                                className={`status-badge ${getStatusClass(
                                  value(
                                    record,
                                    [
                                      'status'
                                    ],
                                    'ACTIVE'
                                  )
                                )}`}
                              >
                                {
                                  value(
                                    record,
                                    [
                                      'status'
                                    ],
                                    'ACTIVE'
                                  )
                                }
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* RECORD DETAILS */}
            {medicalRecords.length > 0 && (

              <div className="appointments">

                <h2>
                  Clinical Information
                </h2>

                {medicalRecords.map(
                  (record, index) => (

                    <div
                      key={
                        record.id ||
                        index
                      }
                      className="appointment-reason"
                    >

                      <strong>
                        {
                          value(
                            record,
                            [
                              'patientName',
                              'patient'
                            ],
                            'Patient'
                          )
                        }
                      </strong>

                      <span>

                        {
                          value(
                            record,
                            [
                              'notes',
                              'clinicalNotes',
                              'remarks',
                              'description'
                            ],
                            'Medical record available'
                          )
                        }

                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </>

        )}

        {/* ================================================= */}
        {/* NOTIFICATIONS                                     */}
        {/* ================================================= */}

        {currentPage === 'notifications' && (

          <>

            <PageHeader
              title="Notifications"
              subtitle="View ApexCare system notifications"
            />

            <div className="cards">

              <div className="card">

                Total Notifications

                <strong>
                  {notifications.length}
                </strong>

              </div>

              <div className="card">

                Unread

                <strong>
                  {
                    notifications.filter(
                      (notification) =>
                        value(
                          notification,
                          [
                            'read',
                            'isRead'
                          ],
                          false
                        ) === false
                    ).length
                  }
                </strong>

              </div>

              <div className="card">

                Patient Alerts

                <strong>
                  {
                    notifications.filter(
                      (notification) =>
                        String(
                          value(
                            notification,
                            [
                              'type',
                              'notificationType'
                            ],
                            ''
                          )
                        ).toLowerCase()
                          .includes('patient')
                    ).length
                  }
                </strong>

              </div>

              <div className="card">

                System

                <strong>
                  ACTIVE
                </strong>

              </div>

            </div>

            <div className="recent-patients">

              <h2>
                All Notifications
              </h2>

              {notificationsLoading ? (

                <p>
                  Loading notifications...
                </p>

              ) : notifications.length === 0 ? (

                <p>
                  No notifications found.
                </p>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Notification
                        </th>

                        <th>
                          Type
                        </th>

                        <th>
                          Message
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {notifications.map(
                        (notification, index) => {

                          const read =
                            value(
                              notification,
                              [
                                'read',
                                'isRead'
                              ],
                              false
                            );

                          return (

                            <tr
                              key={
                                notification.id ||
                                index
                              }
                            >

                              <td>

                                <strong>
                                  {
                                    value(
                                      notification,
                                      [
                                        'title',
                                        'notificationTitle',
                                        'id'
                                      ]
                                    )
                                  }
                                </strong>

                              </td>

                              <td>
                                {
                                  value(
                                    notification,
                                    [
                                      'type',
                                      'notificationType'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {
                                  value(
                                    notification,
                                    [
                                      'message',
                                      'content',
                                      'description'
                                    ]
                                  )
                                }
                              </td>

                              <td>
                                {
                                  value(
                                    notification,
                                    [
                                      'createdAt',
                                      'timestamp',
                                      'date'
                                    ]
                                  )
                                }
                              </td>

                              <td>

                                <span
                                  className={`status-badge ${
                                    read
                                      ? 'status-completed'
                                      : 'status-pending'
                                  }`}
                                >
                                  {
                                    read
                                      ? 'READ'
                                      : 'UNREAD'
                                  }
                                </span>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>

        )}


        <style>{`
          .apexcare-form-modal {
            width: min(760px, 96vw);
            max-height: 90vh;
            overflow-y: auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 70px rgba(15, 23, 42, 0.28);
            box-sizing: border-box;
            overflow-x: hidden;
          }
          .apexcare-form-modal.department-modal { width: min(620px, 96vw); }
          .apexcare-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 24px 28px;
            border-bottom: 1px solid #e5e7eb;
          }
          .apexcare-modal-header h2 {
            margin: 0;
            color: #0f172a;
            font-size: 24px;
            line-height: 1.25;
            font-weight: 700;
          }
          .apexcare-modal-header p {
            margin: 6px 0 0;
            color: #64748b;
            font-size: 14px;
          }
          .apexcare-close {
            flex: 0 0 auto;
            width: 36px;
            height: 36px;
            border: 0;
            border-radius: 10px;
            background: #f1f5f9;
            color: #475569;
            font-size: 22px;
            cursor: pointer;
          }
          .apexcare-close:hover { background: #e2e8f0; }
          .apexcare-form {
            padding: 28px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .apexcare-form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          .apexcare-field {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            color: #334155;
            font-size: 14px;
            font-weight: 600;
          }
          .apexcare-field input,
          .apexcare-field select {
            width: 100%;
            min-height: 46px;
            box-sizing: border-box;
            padding: 11px 13px;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            background: #ffffff;
            color: #0f172a;
            font: inherit;
            font-weight: 400;
            outline: none;
            transition: border-color .15s ease, box-shadow .15s ease;
          }
          .apexcare-field input:focus,
          .apexcare-field select:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
          }
          .apexcare-field input::placeholder { color: #94a3b8; }
          .apexcare-modal-actions {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
            padding-top: 4px;
          }
          .apexcare-error {
            padding: 11px 13px;
            border: 1px solid #fecaca;
            border-radius: 10px;
            background: #fef2f2;
            color: #b91c1c;
            font-size: 14px;
          }
          @media (max-width: 640px) {
            .apexcare-modal-header { padding: 20px; }
            .apexcare-form { padding: 20px; }
            .apexcare-form-grid { grid-template-columns: 1fr; gap: 16px; }
          }
        `}</style>

        {/* ================================================= */}
        {/* PATIENT ADD MODAL */}
        {/* ================================================= */}
        {showPatientModal && (
          <div style={{position:'fixed',inset:0,zIndex:100000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'rgba(15,23,42,.65)',boxSizing:'border-box'}}><div className="apexcare-form-modal">
            <div className="apexcare-modal-header"><div><h2>Add New Patient</h2><p>Enter the patient details below.</p></div><button type="button" className="apexcare-close" onClick={closePatientModal} aria-label="Close">×</button></div>
            <form onSubmit={handlePatientSubmit} className="apexcare-form">
              <div className="apexcare-form-grid"><label className="apexcare-field">Patient Name<input value={patientForm.name} onChange={e=>setPatientForm({...patientForm,name:e.target.value})} required /></label><label className="apexcare-field">Email<input type="email" value={patientForm.email} onChange={e=>setPatientForm({...patientForm,email:e.target.value})} required /></label></div>
              <div className="apexcare-form-grid"><label className="apexcare-field">Phone<input value={patientForm.phone} onChange={e=>setPatientForm({...patientForm,phone:e.target.value})} required /></label><label className="apexcare-field">Date of Birth<input type="date" value={patientForm.dateOfBirth} onChange={e=>setPatientForm({...patientForm,dateOfBirth:e.target.value})} required /></label></div>
              <div className="apexcare-form-grid"><label className="apexcare-field">Gender<select value={patientForm.gender} onChange={e=>setPatientForm({...patientForm,gender:e.target.value})}><option>MALE</option><option>FEMALE</option><option>OTHER</option></select></label><label className="apexcare-field">Blood Group<select value={patientForm.bloodGroup} onChange={e=>setPatientForm({...patientForm,bloodGroup:e.target.value})}><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></label></div>
              <div className="apexcare-form-grid"><label className="apexcare-field">Address<input value={patientForm.address} onChange={e=>setPatientForm({...patientForm,address:e.target.value})}/></label><label className="apexcare-field">Emergency Contact<input value={patientForm.emergencyContact} onChange={e=>setPatientForm({...patientForm,emergencyContact:e.target.value})}/></label></div>
              {patientModalError&&<div className="apexcare-error">{patientModalError}</div>}<div className="apexcare-modal-actions"><button type="button" className="btn-secondary" onClick={closePatientModal}>Cancel</button><button type="submit" className="btn-primary" disabled={patientModalLoading}>{patientModalLoading?'Saving...':'Add Patient'}</button></div>
            </form></div></div>
        )}

        {/* ================================================= */}
        {/* APPOINTMENT ADD MODAL */}
        {/* ================================================= */}
        {showAppointmentModal && (
          <div style={{position:'fixed',inset:0,zIndex:100000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'rgba(15,23,42,.65)',boxSizing:'border-box'}}><div className="apexcare-form-modal">
            <div className="apexcare-modal-header"><div><h2>Schedule Appointment</h2><p>Create a new patient appointment.</p></div><button type="button" className="apexcare-close" onClick={closeAppointmentModal} aria-label="Close">×</button></div>
            <form onSubmit={handleAppointmentSubmit} className="apexcare-form">
              <div className="apexcare-form-grid"><label className="apexcare-field">Patient<select value={appointmentForm.patientId} onChange={e=>setAppointmentForm({...appointmentForm,patientId:e.target.value})} required><option value="">Select patient</option>{patients.map(p=><option key={p.id} value={p.id}>{p.name} ({p.patientCode||p.id})</option>)}</select></label><label className="apexcare-field">Doctor<select value={appointmentForm.doctorId} onChange={e=>setAppointmentForm({...appointmentForm,doctorId:e.target.value})} required><option value="">Select doctor</option>{doctors.filter(d=>d.status!=='INACTIVE').map(d=><option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}</select></label></div>
              <div className="apexcare-form-grid"><label className="apexcare-field">Date<input type="date" value={appointmentForm.appointmentDate} onChange={e=>setAppointmentForm({...appointmentForm,appointmentDate:e.target.value})} required /></label><label className="apexcare-field">Time<input type="time" value={appointmentForm.appointmentTime} onChange={e=>setAppointmentForm({...appointmentForm,appointmentTime:e.target.value})} required /></label></div>
              <label className="apexcare-field">Reason<input value={appointmentForm.reason} onChange={e=>setAppointmentForm({...appointmentForm,reason:e.target.value})} required /></label>
              {appointmentModalError&&<div className="apexcare-error">{appointmentModalError}</div>}<div className="apexcare-modal-actions"><button type="button" className="btn-secondary" onClick={closeAppointmentModal}>Cancel</button><button type="submit" className="btn-primary" disabled={appointmentModalLoading}>{appointmentModalLoading?'Scheduling...':'Schedule Appointment'}</button></div>
            </form></div></div>
        )}

        {/* ================================================= */}
        {/* DEPARTMENT ADD MODAL */}
        {/* ================================================= */}
        {showDepartmentModal && (
          <div style={{position:'fixed',inset:0,zIndex:100000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'rgba(15,23,42,.65)',boxSizing:'border-box'}}><div className="apexcare-form-modal department-modal">
            <div className="apexcare-modal-header"><div><h2>Add New Department</h2><p>Add a department to ApexCare.</p></div><button type="button" className="apexcare-close" onClick={closeDepartmentModal} aria-label="Close">×</button></div>
            <form onSubmit={handleDepartmentSubmit} className="apexcare-form">
              <label className="apexcare-field">Department Name<input value={departmentForm.name} onChange={e=>setDepartmentForm({...departmentForm,name:e.target.value})} required /></label><label className="apexcare-field">Description<input value={departmentForm.description} onChange={e=>setDepartmentForm({...departmentForm,description:e.target.value})}/></label><label className="apexcare-field">Status<select value={departmentForm.status} onChange={e=>setDepartmentForm({...departmentForm,status:e.target.value})}><option>ACTIVE</option><option>INACTIVE</option></select></label>
              {departmentModalError&&<div className="apexcare-error">{departmentModalError}</div>}<div className="apexcare-modal-actions"><button type="button" className="btn-secondary" onClick={closeDepartmentModal}>Cancel</button><button type="submit" className="btn-primary" disabled={departmentModalLoading}>{departmentModalLoading?'Saving...':'Add Department'}</button></div>
            </form></div></div>
        )}

        {/* ================================================= */}
        {/* DOCTOR ADD / EDIT MODAL                           */}
        {/* ================================================= */}

        {showDoctorModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(15, 23, 42, 0.62)',
              backdropFilter: 'blur(4px)',
              boxSizing: 'border-box'
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeDoctorModal();
              }
            }}
          >
            <div
              style={{
                width: 'min(720px, 96vw)',
                maxHeight: '92vh',
                overflowY: 'auto',
                background: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 25px 70px rgba(15, 23, 42, 0.28)',
                padding: '0',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px 28px',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: '#0f172a',
                      fontSize: '24px',
                      fontWeight: 700
                    }}
                  >
                    {isEditMode ? 'Edit Doctor' : 'Add New Doctor'}
                  </h2>
                  <p
                    style={{
                      margin: '6px 0 0',
                      color: '#64748b',
                      fontSize: '14px'
                    }}
                  >
                    {isEditMode
                      ? 'Update the doctor information below.'
                      : 'Enter the doctor details to add them to ApexCare.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDoctorModal}
                  disabled={modalLoading}
                  aria-label="Close"
                  style={{
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: '22px',
                    cursor: modalLoading ? 'not-allowed' : 'pointer',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleDoctorSubmit}
                style={{
                  padding: '28px',
                  display: 'grid',
                  gap: '20px'
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '18px'
                  }}
                >
                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Doctor Name *
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Dr. Arjun Reddy"
                      required
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>

                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Email *
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="doctor@apexcare.com"
                      required
                      readOnly={isEditMode}
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: isEditMode ? '#64748b' : '#0f172a',
                        background: isEditMode ? '#f8fafc' : '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>

                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Specialization *
                    <input
                      type="text"
                      value={formSpecialization}
                      onChange={(e) => setFormSpecialization(e.target.value)}
                      placeholder="e.g. Cardiologist"
                      required
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '18px'
                  }}
                >
                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Phone
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>

                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Qualification
                    <input
                      type="text"
                      value={formQualification}
                      onChange={(e) => setFormQualification(e.target.value)}
                      placeholder="e.g. MBBS, MD"
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>
                </div>

                <label
                  style={{
                    display: 'grid',
                    gap: '8px',
                    color: '#334155',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  License Number
                  <input
                    type="text"
                    value={formLicenseNumber}
                    onChange={(e) => setFormLicenseNumber(e.target.value)}
                    placeholder="e.g. MED-12345"
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      padding: '0 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      outline: 'none',
                      color: '#0f172a',
                      background: '#ffffff',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>

                <label
                  style={{
                    display: 'grid',
                    gap: '8px',
                    color: '#334155',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Department *
                  <select
                    value={formDepartmentId}
                    onChange={(e) => setFormDepartmentId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      padding: '0 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      outline: 'none',
                      color: formDepartmentId ? '#0f172a' : '#94a3b8',
                      background: '#ffffff',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '18px'
                  }}
                >
                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Experience (Years) *
                    <input
                      type="number"
                      min="0"
                      value={formExperience}
                      onChange={(e) => setFormExperience(e.target.value)}
                      placeholder="e.g. 10"
                      required
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>

                  <label
                    style={{
                      display: 'grid',
                      gap: '8px',
                      color: '#334155',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Consultation Fee (₹) *
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formConsultationFee}
                      onChange={(e) => setFormConsultationFee(e.target.value)}
                      placeholder="e.g. 600"
                      required
                      style={{
                        width: '100%',
                        minHeight: '46px',
                        padding: '0 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#ffffff',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </label>
                </div>

                <label
                  style={{
                    display: 'grid',
                    gap: '8px',
                    color: '#334155',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Status
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      padding: '0 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      outline: 'none',
                      color: '#0f172a',
                      background: '#ffffff',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </label>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    fontSize: '13px',
                    lineHeight: 1.5
                  }}
                >
                  <strong>Note:</strong> For a new doctor, the backend automatically
                  creates the doctor account, generates the doctor code, assigns the
                  default password <strong>Doctor@123</strong>, and creates Monday-Friday
                  availability from 09:00 to 17:00.
                </div>

                {modalError && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '14px'
                    }}
                  >
                    {modalError}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '6px',
                    borderTop: '1px solid #e5e7eb'
                  }}
                >
                  <button
                    type="button"
                    onClick={closeDoctorModal}
                    disabled={modalLoading}
                    style={{
                      minWidth: '110px',
                      minHeight: '44px',
                      padding: '0 18px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: modalLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={modalLoading}
                    style={{
                      minWidth: '145px',
                      minHeight: '44px',
                      padding: '0 20px',
                      border: 'none',
                      borderRadius: '10px',
                      background: modalLoading ? '#94a3b8' : '#0f6b9a',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: modalLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 6px 14px rgba(15, 107, 154, 0.22)'
                    }}
                  >
                    {modalLoading
                      ? 'Saving...'
                      : isEditMode
                        ? 'Update Doctor'
                        : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

export default App;