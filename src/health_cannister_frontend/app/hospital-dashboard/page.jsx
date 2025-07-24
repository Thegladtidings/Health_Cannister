"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./hospital-dashboard.module.css"

export default function HospitalDashboard() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientRecords, setPatientRecords] = useState([])
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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
  const router = useRouter()

  useEffect(() => {
    // Simulate fetching patients
    const mockPatients = [
      { id: "P001", name: "John Doe", age: 35, bloodType: "O+", lastVisit: "2024-03-10" },
      { id: "P002", name: "Jane Smith", age: 28, bloodType: "A-", lastVisit: "2024-03-08" },
      { id: "P003", name: "Robert Johnson", age: 45, bloodType: "B+", lastVisit: "2024-03-05" },
      { id: "P004", name: "Emily Davis", age: 32, bloodType: "AB+", lastVisit: "2024-03-03" },
    ]
    setPatients(mockPatients)
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      // Simulate fetching detailed patient records from blockchain
      const mockRecords = [
        {
          id: "R001",
          patientId: selectedPatient.id,
          date: "2024-01-15",
          hospital: "City General Hospital",
          doctor: "Dr. Sarah Johnson",
          department: "Cardiology",
          visitType: "Follow-up",
          chiefComplaint: "Routine blood pressure check",
          diagnosis: "Essential Hypertension",
          treatment: "Continue current medication, lifestyle modifications",
          medications: ["Lisinopril 10mg", "Hydrochlorothiazide 25mg"],
          vitalSigns: {
            bloodPressure: "138/88 mmHg",
            heartRate: "72 bpm",
            temperature: "98.6°F",
            respiratoryRate: "16/min",
            oxygenSaturation: "98%",
            weight: "175 lbs",
            height: "5'10\"",
          },
          labResults: [
            { test: "Total Cholesterol", value: "195 mg/dL", range: "<200 mg/dL", status: "Normal" },
            { test: "HDL Cholesterol", value: "45 mg/dL", range: ">40 mg/dL", status: "Normal" },
            { test: "LDL Cholesterol", value: "125 mg/dL", range: "<100 mg/dL", status: "Elevated" },
            { test: "Triglycerides", value: "150 mg/dL", range: "<150 mg/dL", status: "Normal" },
          ],
          notes:
            "Patient reports good adherence to medication. Blood pressure slightly elevated. Recommend dietary changes and increased exercise.",
          followUp: "3 months",
          blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j",
          verified: true,
        },
        {
          id: "R002",
          patientId: selectedPatient.id,
          date: "2024-02-20",
          hospital: "Metro Medical Center",
          doctor: "Dr. Michael Chen",
          department: "Internal Medicine",
          visitType: "Annual Physical",
          chiefComplaint: "Annual physical examination",
          diagnosis: "Annual Physical Exam - Overall Good Health",
          treatment: "Continue current medications, routine preventive care",
          medications: [],
          vitalSigns: {
            bloodPressure: "132/82 mmHg",
            heartRate: "68 bpm",
            temperature: "98.4°F",
            respiratoryRate: "14/min",
            oxygenSaturation: "99%",
            weight: "173 lbs",
            height: "5'10\"",
          },
          labResults: [
            { test: "Complete Blood Count", value: "Normal", range: "Normal", status: "Normal" },
            { test: "Comprehensive Metabolic Panel", value: "Normal", range: "Normal", status: "Normal" },
            { test: "HbA1c", value: "6.8%", range: "<7%", status: "Good Control" },
            { test: "PSA", value: "1.2 ng/mL", range: "<4.0 ng/mL", status: "Normal" },
          ],
          notes: "Patient in good overall health. Diabetes well controlled. Continue current management plan.",
          followUp: "1 year",
          blockchainHash: "0x2b3c4d5e6f7g8h9i0j1k",
          verified: true,
        },
      ]
      setPatientRecords(mockRecords)
    }
  }, [selectedPatient])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const handleAddRecord = (e) => {
    e.preventDefault()
    if (!selectedPatient) return

    const record = {
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
      blockchainHash: `0x${Math.random().toString(16).substr(2, 20)}`,
      verified: true,
    }

    setPatientRecords([...patientRecords, record])
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
    setShowAddRecord(false)
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
          <h1>HealthChain Hospital Portal</h1>
          <div className={styles.headerActions}>
            <span className={styles.hospitalInfo}>City General Hospital</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <div className={styles.searchSection}>
            <h3>Patient Search</h3>
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
            {filteredPatients.map((patient) => (
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
            ))}
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
                <button onClick={() => setShowAddRecord(true)} className={styles.addRecordButton}>
                  Add New Record
                </button>
              </div>

              <div className={styles.recordsSection}>
                <h3>Medical Records History</h3>
                {patientRecords.length > 0 ? (
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

                          {record.labResults && record.labResults.length > 0 && (
                            <div className={styles.labSection}>
                              <h4>Lab Results:</h4>
                              {record.labResults.map((lab, index) => (
                                <div key={index} className={styles.labResult}>
                                  <span>
                                    {lab.test}: {lab.value}
                                  </span>
                                  <span
                                    className={`${styles.labStatus} ${styles[lab.status.toLowerCase().replace(" ", "")]}`}
                                  >
                                    {lab.status}
                                  </span>
                                </div>
                              ))}
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
                    <label>Respiratory Rate:</label>
                    <input
                      type="text"
                      placeholder="16/min"
                      value={newRecord.vitalSigns.respiratoryRate}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          vitalSigns: { ...newRecord.vitalSigns, respiratoryRate: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Oxygen Saturation:</label>
                    <input
                      type="text"
                      placeholder="98%"
                      value={newRecord.vitalSigns.oxygenSaturation}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          vitalSigns: { ...newRecord.vitalSigns, oxygenSaturation: e.target.value },
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
              <div className={styles.formGroup}>
                <label>Follow-up Instructions:</label>
                <input
                  type="text"
                  value={newRecord.followUp}
                  onChange={(e) => setNewRecord({ ...newRecord, followUp: e.target.value })}
                  placeholder="e.g., 2 weeks, 3 months, as needed"
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddRecord(false)} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Add to Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
