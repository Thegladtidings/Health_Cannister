import  React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMockPatients, getMockPatientRecords, generateBlockchainHash } from "../utils/mockData"
// import { addPatient, addPatientRecord, getPatients, getPatientRecords } from "../services/api"
import styles from "./HospitalDashboard.module.css"

function HospitalDashboard() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientRecords, setPatientRecords] = useState([])
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newPatient, setNewPatient] = useState({
    name: "",
    dateOfBirth: "",
    gender: "Male",
    bloodType: "O+",
    phone: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
  })

  const [newRecord, setNewRecord] = useState({
    diagnosis: "",
    treatment: "",
    medications: "",
    doctor: "Dr. Current User",
    chiefComplaint: "",
    department: "General Medicine",
    visitType: "Follow-up",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "",
      height: "",
    },
    notes: "",
    followUp: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType")
    const userId = localStorage.getItem("userId")

    if (!userType || userType !== "hospital" || !userId) {
      navigate("/")
      return
    }

    // Load patients data
    loadPatients()
  }, [navigate])

  useEffect(() => {
    if (selectedPatient) {
      loadPatientRecords(selectedPatient.id)
    }
  }, [selectedPatient])

  const loadPatients = async () => {
    try {
      setLoading(true)
      // Try to fetch from backend, fallback to mock data
      const patientsData = await getPatients()
      setPatients(patientsData)
    } catch (err) {
      console.log("Backend not available, using mock data")
      const mockPatients = getMockPatients()
      setPatients(mockPatients)
    } finally {
      setLoading(false)
    }
  }

  const loadPatientRecords = async (patientId) => {
    try {
      setLoading(true)
      // Try to fetch from backend, fallback to mock data
      const recordsData = await getPatientRecords(patientId)
      setPatientRecords(recordsData)
    } catch (err) {
      console.log("Backend not available, using mock data")
      const mockRecords = getMockPatientRecords(patientId)
      setPatientRecords(mockRecords)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const resetNewPatientForm = () => {
    setNewPatient({
      name: "",
      dateOfBirth: "",
      gender: "Male",
      bloodType: "O+",
      phone: "",
      email: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      chronicConditions: "",
      currentMedications: "",
    })
  }

  const resetNewRecordForm = () => {
    setNewRecord({
      diagnosis: "",
      treatment: "",
      medications: "",
      doctor: "Dr. Current User",
      chiefComplaint: "",
      department: "General Medicine",
      visitType: "Follow-up",
      vitalSigns: {
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        weight: "",
        height: "",
      },
      notes: "",
      followUp: "",
    })
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleAddPatient = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const patientData = {
        ...newPatient,
        age: calculateAge(newPatient.dateOfBirth),
        id: `P${Date.now()}`, // Generate temporary ID
        lastVisit: new Date().toISOString().split("T")[0],
      }

      // Try to send to backend
      const savedPatient = await addPatient(patientData)

      // Update local state
      setPatients([...patients, savedPatient])
      setSuccess("Patient added successfully!")
      resetNewPatientForm()
      setShowAddPatient(false)
    } catch (err) {
      console.error("Error adding patient:", err)
      setError("Failed to add patient. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecord = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!selectedPatient) return

    try {
      const recordData = {
        id: `R${Date.now()}`,
        patientId: selectedPatient.id,
        date: new Date().toISOString().split("T")[0],
        hospital: "Current Hospital",
        doctor: newRecord.doctor,
        department: newRecord.department,
        visitType: newRecord.visitType,
        chiefComplaint: newRecord.chiefComplaint,
        diagnosis: newRecord.diagnosis,
        treatment: newRecord.treatment,
        medications: newRecord.medications
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m),
        vitalSigns: newRecord.vitalSigns,
        labResults: [],
        notes: newRecord.notes,
        followUp: newRecord.followUp,
        blockchainHash: generateBlockchainHash(),
        verified: true,
      }

      // Try to send to backend
      const savedRecord = await addPatientRecord(recordData)

      // Update local state
      setPatientRecords([...patientRecords, savedRecord])
      setSuccess("Medical record added successfully!")
      resetNewRecordForm()
      setShowAddRecord(false)
    } catch (err) {
      console.error("Error adding record:", err)
      setError("Failed to add medical record. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Health Canister Hospital Portal</h1>
          <div className={styles.headerActions}>
            <span className={styles.hospitalInfo}>City General Hospital</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Status Messages */}
      {error && (
        <div className={styles.errorMessage}>
          <span>❌ {error}</span>
          <button onClick={() => setError("")} className={styles.closeMessage}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          <span>✅ {success}</span>
          <button onClick={() => setSuccess("")} className={styles.closeMessage}>
            ×
          </button>
        </div>
      )}

      <div className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <div className={styles.searchSection}>
            <h3>Patient Management</h3>
            <button onClick={() => setShowAddPatient(true)} className={styles.addPatientButton} disabled={loading}>
              + Add New Patient
            </button>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.patientsList}>
            <h3>Patients ({filteredPatients.length})</h3>
            {loading ? (
              <div className={styles.loadingState}>Loading patients...</div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`${styles.patientItem} ${selectedPatient?.id === patient.id ? styles.selected : ""}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className={styles.patientName}>{patient.name}</div>
                  <div className={styles.patientId}>ID: {patient.id}</div>
                  <div className={styles.patientInfo}>
                    Age: {patient.age} | Blood: {patient.bloodType}
                  </div>
                  <div className={styles.lastVisit}>Last visit: {patient.lastVisit}</div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className={styles.mainContent}>
          {selectedPatient ? (
            <div className={styles.patientDetails}>
              <div className={styles.patientHeader}>
                <div className={styles.patientInfo}>
                  <h2>{selectedPatient.name}</h2>
                  <p>Patient ID: {selectedPatient.id}</p>
                  <div className={styles.patientMeta}>
                    <span>Age: {selectedPatient.age}</span>
                    <span>Blood Type: {selectedPatient.bloodType}</span>
                    <span>Last Visit: {selectedPatient.lastVisit}</span>
                  </div>
                </div>
                <button onClick={() => setShowAddRecord(true)} className={styles.addRecordButton} disabled={loading}>
                  Add New Record
                </button>
              </div>

              <div className={styles.recordsSection}>
                <h3>Medical Records History</h3>
                {loading ? (
                  <div className={styles.loadingState}>Loading records...</div>
                ) : patientRecords.length > 0 ? (
                  <div className={styles.recordsGrid}>
                    {patientRecords.map((record) => (
                      <div key={record.id} className={styles.recordCard}>
                        <div className={styles.recordCardHeader}>
                          <div className={styles.recordDate}>{record.date}</div>
                          <div className={styles.recordVerification}>✓ Blockchain Verified</div>
                        </div>
                        <div className={styles.recordCardContent}>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Doctor:</span>
                            <span>{record.doctor}</span>
                          </div>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Department:</span>
                            <span>{record.department}</span>
                          </div>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Visit Type:</span>
                            <span>{record.visitType}</span>
                          </div>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Chief Complaint:</span>
                            <span>{record.chiefComplaint}</span>
                          </div>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Diagnosis:</span>
                            <span>{record.diagnosis}</span>
                          </div>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Treatment:</span>
                            <span>{record.treatment}</span>
                          </div>
                          {record.medications.length > 0 && (
                            <div className={styles.recordField}>
                              <span className={styles.fieldLabel}>Medications:</span>
                              <span>{record.medications.join(", ")}</span>
                            </div>
                          )}

                          {record.vitalSigns && Object.keys(record.vitalSigns).length > 0 && (
                            <div className={styles.vitalsSection}>
                              <h4>Vital Signs:</h4>
                              <div className={styles.vitalsGrid}>
                                {Object.entries(record.vitalSigns).map(
                                  ([key, value]) =>
                                    value && (
                                      <div key={key} className={styles.vitalItem}>
                                        <span className={styles.vitalLabel}>
                                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                                        </span>
                                        <span>{value}</span>
                                      </div>
                                    ),
                                )}
                              </div>
                            </div>
                          )}

                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Notes:</span>
                            <span>{record.notes}</span>
                          </div>
                          <div className={styles.recordField}>
                            <span className={styles.fieldLabel}>Follow-up:</span>
                            <span>{record.followUp}</span>
                          </div>
                          <div className={styles.blockchainHash}>Hash: {record.blockchainHash}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noRecords}>
                    <p>No medical records found for this patient.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <h2>Select a Patient</h2>
              <p>Choose a patient from the sidebar to view their medical records</p>
            </div>
          )}
        </main>
      </div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Patient</h3>
              <button onClick={() => setShowAddPatient(false)} className={styles.closeButton}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddPatient} className={styles.patientForm}>
              <div className={styles.formSection}>
                <h4>Personal Information</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *:</label>
                    <input
                      type="text"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      required
                      placeholder="Enter patient's full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Date of Birth *:</label>
                    <input
                      type="date"
                      value={newPatient.dateOfBirth}
                      onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Gender:</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Blood Type:</label>
                    <select
                      value={newPatient.bloodType}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Address:</label>
                  <textarea
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    rows={2}
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h4>Emergency Contact</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Contact Name:</label>
                    <input
                      type="text"
                      value={newPatient.emergencyContactName}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContactName: e.target.value })}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Contact Phone:</label>
                    <input
                      type="tel"
                      value={newPatient.emergencyContactPhone}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContactPhone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Relationship:</label>
                  <input
                    type="text"
                    value={newPatient.emergencyContactRelation}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContactRelation: e.target.value })}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h4>Insurance Information</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Insurance Provider:</label>
                    <input
                      type="text"
                      value={newPatient.insuranceProvider}
                      onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                      placeholder="Insurance company name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Policy Number:</label>
                    <input
                      type="text"
                      value={newPatient.insurancePolicyNumber}
                      onChange={(e) => setNewPatient({ ...newPatient, insurancePolicyNumber: e.target.value })}
                      placeholder="Policy number"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h4>Medical Information</h4>
                <div className={styles.formGroup}>
                  <label>Known Allergies:</label>
                  <textarea
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    rows={2}
                    placeholder="List any known allergies (comma-separated)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Chronic Conditions:</label>
                  <textarea
                    value={newPatient.chronicConditions}
                    onChange={(e) => setNewPatient({ ...newPatient, chronicConditions: e.target.value })}
                    rows={2}
                    placeholder="List any chronic conditions (comma-separated)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Current Medications:</label>
                  <textarea
                    value={newPatient.currentMedications}
                    onChange={(e) => setNewPatient({ ...newPatient, currentMedications: e.target.value })}
                    rows={2}
                    placeholder="List current medications (comma-separated)"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowAddPatient(false)}
                  className={styles.cancelButton}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? "Adding Patient..." : "Add Patient to System"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Medical Record</h3>
              <button onClick={() => setShowAddRecord(false)} className={styles.closeButton}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddRecord} className={styles.recordForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Patient:</label>
                  <input type="text" value={selectedPatient?.name || ""} disabled className={styles.disabledInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Doctor:</label>
                  <input
                    type="text"
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Department:</label>
                  <select
                    value={newRecord.department}
                    onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Visit Type:</label>
                  <select
                    value={newRecord.visitType}
                    onChange={(e) => setNewRecord({ ...newRecord, visitType: e.target.value })}
                  >
                    <option value="Follow-up">Follow-up</option>
                    <option value="New Patient">New Patient</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Annual Physical">Annual Physical</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Chief Complaint:</label>
                <input
                  type="text"
                  value={newRecord.chiefComplaint}
                  onChange={(e) => setNewRecord({ ...newRecord, chiefComplaint: e.target.value })}
                  placeholder="Patient's main concern or reason for visit"
                  required
                />
              </div>

              <div className={styles.vitalsSection}>
                <h4>Vital Signs</h4>
                <div className={styles.vitalsInputGrid}>
                  <div className={styles.formGroup}>
                    <label>Blood Pressure:</label>
                    <input
                      type="text"
                      placeholder="120/80 mmHg"
                      value={newRecord.vitalSigns.bloodPressure}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          vitalSigns: { ...newRecord.vitalSigns, bloodPressure: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Heart Rate:</label>
                    <input
                      type="text"
                      placeholder="72 bpm"
                      value={newRecord.vitalSigns.heartRate}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          vitalSigns: { ...newRecord.vitalSigns, heartRate: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Temperature:</label>
                    <input
                      type="text"
                      placeholder="98.6°F"
                      value={newRecord.vitalSigns.temperature}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          vitalSigns: { ...newRecord.vitalSigns, temperature: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Weight:</label>
                    <input
                      type="text"
                      placeholder="175 lbs"
                      value={newRecord.vitalSigns.weight}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          vitalSigns: { ...newRecord.vitalSigns, weight: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Diagnosis:</label>
                <textarea
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                  required
                  rows={3}
                  placeholder="Enter diagnosis details"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Treatment Plan:</label>
                <textarea
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                  required
                  rows={3}
                  placeholder="Enter treatment plan"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Medications (comma-separated):</label>
                <input
                  type="text"
                  value={newRecord.medications}
                  onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                  placeholder="e.g., Aspirin 100mg, Lisinopril 10mg"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Clinical Notes:</label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  rows={4}
                  placeholder="Additional notes and observations"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowAddRecord(false)}
                  className={styles.cancelButton}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? "Adding Record..." : "Add to Blockchain"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalDashboard
