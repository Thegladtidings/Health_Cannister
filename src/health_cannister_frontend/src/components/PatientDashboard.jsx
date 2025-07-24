import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./PatientDashboard.module.css"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("records")
  const [records, setRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [patientInfo, setPatientInfo] = useState({
    personalInfo: {
      name: "John Doe",
      id: "P001",
      dateOfBirth: "1989-05-15",
      age: 35,
      gender: "Male",
      bloodType: "O+",
      height: "5'10\"",
      weight: "175 lbs",
      phone: "(555) 123-4567",
      email: "john.doe@email.com",
      address: "123 Main St, City, State 12345",
    },
    medicalInfo: {
      allergies: [
        { allergen: "Penicillin", severity: "Severe", reaction: "Anaphylaxis" },
        { allergen: "Shellfish", severity: "Moderate", reaction: "Hives, swelling" },
        { allergen: "Pollen", severity: "Mild", reaction: "Sneezing, runny nose" },
      ],
      chronicConditions: [
        { condition: "Hypertension", diagnosedDate: "2020-03-15", status: "Controlled" },
        { condition: "Type 2 Diabetes", diagnosedDate: "2021-08-22", status: "Managed" },
      ],
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          prescribedBy: "Dr. Sarah Johnson",
          startDate: "2020-03-15",
          purpose: "Blood pressure control",
        },
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          prescribedBy: "Dr. Michael Chen",
          startDate: "2021-08-22",
          purpose: "Diabetes management",
        },
      ],
      immunizations: [
        { vaccine: "COVID-19 (Pfizer)", date: "2023-09-15", nextDue: "2024-09-15" },
        { vaccine: "Influenza", date: "2023-10-01", nextDue: "2024-10-01" },
        { vaccine: "Tetanus", date: "2022-05-10", nextDue: "2032-05-10" },
      ],
    },
    emergencyContacts: [
      { name: "Jane Doe", relationship: "Spouse", phone: "(555) 123-4568" },
      { name: "Robert Doe", relationship: "Father", phone: "(555) 123-4569" },
    ],
    insurance: {
      provider: "HealthCare Plus",
      policyNumber: "HC123456789",
      groupNumber: "GRP001",
      effectiveDate: "2023-01-01",
      expirationDate: "2023-12-31",
    },
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const userType = localStorage.getItem("userType")
    if (!userType || userType !== "patient") {
      navigate("/")
      return
    }

    // Simulate fetching detailed records from ICP blockchain
    const mockRecords = [
      {
        id: "R001",
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
      {
        id: "R003",
        date: "2024-03-10",
        hospital: "City General Hospital",
        doctor: "Dr. Emily Rodriguez",
        department: "Family Medicine",
        visitType: "Sick Visit",
        chiefComplaint: "Cough, congestion, and fatigue for 3 days",
        diagnosis: "Upper Respiratory Infection (Viral)",
        treatment: "Symptomatic treatment, rest, increased fluid intake",
        medications: ["Amoxicillin 500mg", "Ibuprofen 400mg", "Robitussin DM"],
        vitalSigns: {
          bloodPressure: "140/85 mmHg",
          heartRate: "78 bpm",
          temperature: "100.2°F",
          respiratoryRate: "18/min",
          oxygenSaturation: "97%",
          weight: "174 lbs",
          height: "5'10\"",
        },
        labResults: [
          { test: "Rapid Strep Test", value: "Negative", range: "Negative", status: "Normal" },
          { test: "COVID-19 Antigen", value: "Negative", range: "Negative", status: "Normal" },
        ],
        notes: "Viral upper respiratory infection. No signs of bacterial infection. Symptomatic treatment recommended.",
        followUp: "As needed, return if symptoms worsen",
        blockchainHash: "0x3c4d5e6f7g8h9i0j1k2l",
        verified: true,
      },
    ]
    setRecords(mockRecords)
  }, [navigate])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const renderRecordsTab = () => (
    <div className={styles.recordsContent}>
      <div className={styles.recordsList}>
        <h3>Medical Records History</h3>
        {records.map((record) => (
          <div
            key={record.id}
            className={`${styles.recordItem} ${selectedRecord?.id === record.id ? styles.selected : ""}`}
            onClick={() => setSelectedRecord(record)}
          >
            <div className={styles.recordDate}>{record.date}</div>
            <div className={styles.recordHospital}>{record.hospital}</div>
            <div className={styles.recordDiagnosis}>{record.diagnosis}</div>
            <div className={styles.recordType}>{record.visitType}</div>
            <div className={styles.verificationBadge}>{record.verified ? "✓ Verified" : "⚠ Pending"}</div>
          </div>
        ))}
      </div>

      <div className={styles.recordDetails}>
        {selectedRecord ? (
          <div>
            <div className={styles.recordHeader}>
              <h2>Medical Record Details</h2>
              <div className={styles.blockchainInfo}>
                <span className={styles.blockchainLabel}>Blockchain Hash:</span>
                <span className={styles.blockchainHash}>{selectedRecord.blockchainHash}</span>
                <span className={styles.verifiedBadge}>✓ Tamper-Proof</span>
              </div>
            </div>

            <div className={styles.recordContent}>
              <div className={styles.recordSection}>
                <h3>Visit Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Date:</span>
                    <span>{selectedRecord.date}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Hospital:</span>
                    <span>{selectedRecord.hospital}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Doctor:</span>
                    <span>{selectedRecord.doctor}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Department:</span>
                    <span>{selectedRecord.department}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Visit Type:</span>
                    <span>{selectedRecord.visitType}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Chief Complaint:</span>
                    <span>{selectedRecord.chiefComplaint}</span>
                  </div>
                </div>
              </div>

              <div className={styles.recordSection}>
                <h3>Vital Signs</h3>
                <div className={styles.vitalsGrid}>
                  {Object.entries(selectedRecord.vitalSigns).map(([key, value]) => (
                    <div key={key} className={styles.vitalItem}>
                      <span className={styles.vitalLabel}>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                      </span>
                      <span className={styles.vitalValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
                <div className={styles.recordSection}>
                  <h3>Laboratory Results</h3>
                  <div className={styles.labResults}>
                    {selectedRecord.labResults.map((lab, index) => (
                      <div key={index} className={styles.labItem}>
                        <div className={styles.labTest}>{lab.test}</div>
                        <div className={styles.labValue}>{lab.value}</div>
                        <div className={styles.labRange}>Range: {lab.range}</div>
                        <div className={`${styles.labStatus} ${styles[lab.status.toLowerCase().replace(" ", "")]}`}>
                          {lab.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.recordSection}>
                <h3>Diagnosis</h3>
                <p>{selectedRecord.diagnosis}</p>
              </div>

              <div className={styles.recordSection}>
                <h3>Treatment Plan</h3>
                <p>{selectedRecord.treatment}</p>
              </div>

              {selectedRecord.medications.length > 0 && (
                <div className={styles.recordSection}>
                  <h3>Medications Prescribed</h3>
                  <ul className={styles.medicationList}>
                    {selectedRecord.medications.map((med, index) => (
                      <li key={index}>{med}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.recordSection}>
                <h3>Clinical Notes</h3>
                <p>{selectedRecord.notes}</p>
              </div>

              <div className={styles.recordSection}>
                <h3>Follow-up</h3>
                <p>{selectedRecord.followUp}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h2>Select a Medical Record</h2>
            <p>Choose a record from the list to view detailed information</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderProfileTab = () => (
    <div className={styles.profileContent}>
      <div className={styles.profileSection}>
        <h3>Personal Information</h3>
        <div className={styles.profileGrid}>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Full Name:</span>
            <span>{patientInfo.personalInfo.name}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Patient ID:</span>
            <span>{patientInfo.personalInfo.id}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Date of Birth:</span>
            <span>{patientInfo.personalInfo.dateOfBirth}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Age:</span>
            <span>{patientInfo.personalInfo.age}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Gender:</span>
            <span>{patientInfo.personalInfo.gender}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Blood Type:</span>
            <span>{patientInfo.personalInfo.bloodType}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Height:</span>
            <span>{patientInfo.personalInfo.height}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Weight:</span>
            <span>{patientInfo.personalInfo.weight}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Phone:</span>
            <span>{patientInfo.personalInfo.phone}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Email:</span>
            <span>{patientInfo.personalInfo.email}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Address:</span>
            <span>{patientInfo.personalInfo.address}</span>
          </div>
        </div>
      </div>

      <div className={styles.profileSection}>
        <h3>Allergies</h3>
        <div className={styles.allergiesList}>
          {patientInfo.medicalInfo.allergies.map((allergy, index) => (
            <div key={index} className={styles.allergyItem}>
              <div className={styles.allergyName}>{allergy.allergen}</div>
              <div className={`${styles.allergySeverity} ${styles[allergy.severity.toLowerCase()]}`}>
                {allergy.severity}
              </div>
              <div className={styles.allergyReaction}>{allergy.reaction}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.profileSection}>
        <h3>Chronic Conditions</h3>
        <div className={styles.conditionsList}>
          {patientInfo.medicalInfo.chronicConditions.map((condition, index) => (
            <div key={index} className={styles.conditionItem}>
              <div className={styles.conditionName}>{condition.condition}</div>
              <div className={styles.conditionDate}>Diagnosed: {condition.diagnosedDate}</div>
              <div className={`${styles.conditionStatus} ${styles[condition.status.toLowerCase()]}`}>
                {condition.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.profileSection}>
        <h3>Current Medications</h3>
        <div className={styles.medicationsList}>
          {patientInfo.medicalInfo.medications.map((medication, index) => (
            <div key={index} className={styles.medicationItem}>
              <div className={styles.medicationHeader}>
                <div className={styles.medicationName}>{medication.name}</div>
                <div className={styles.medicationDosage}>{medication.dosage}</div>
              </div>
              <div className={styles.medicationDetails}>
                <div className={styles.medicationFreq}>Frequency: {medication.frequency}</div>
                <div className={styles.medicationPurpose}>Purpose: {medication.purpose}</div>
                <div className={styles.medicationPrescriber}>Prescribed by: {medication.prescribedBy}</div>
                <div className={styles.medicationStart}>Started: {medication.startDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.profileSection}>
        <h3>Immunization History</h3>
        <div className={styles.immunizationsList}>
          {patientInfo.medicalInfo.immunizations.map((immunization, index) => (
            <div key={index} className={styles.immunizationItem}>
              <div className={styles.vaccineName}>{immunization.vaccine}</div>
              <div className={styles.vaccineDate}>Last: {immunization.date}</div>
              <div className={styles.vaccineNext}>Next Due: {immunization.nextDue}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.profileSection}>
        <h3>Emergency Contacts</h3>
        <div className={styles.contactsList}>
          {patientInfo.emergencyContacts.map((contact, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactName}>{contact.name}</div>
              <div className={styles.contactRelation}>{contact.relationship}</div>
              <div className={styles.contactPhone}>{contact.phone}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.profileSection}>
        <h3>Insurance Information</h3>
        <div className={styles.insuranceInfo}>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Provider:</span>
            <span>{patientInfo.insurance.provider}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Policy Number:</span>
            <span>{patientInfo.insurance.policyNumber}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Group Number:</span>
            <span>{patientInfo.insurance.groupNumber}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Effective Date:</span>
            <span>{patientInfo.insurance.effectiveDate}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Expiration Date:</span>
            <span>{patientInfo.insurance.expirationDate}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Health Canister Patient Portal</h1>
          <div className={styles.headerActions}>
            <div className={styles.patientWelcome}>Welcome, {patientInfo.personalInfo.name}</div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.dashboard}>
        <nav className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === "records" ? styles.active : ""}`}
            onClick={() => setActiveTab("records")}
          >
            📋 Medical Records
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Patient Profile
          </button>
        </nav>

        <main className={styles.mainContent}>
          {activeTab === "records" && renderRecordsTab()}
          {activeTab === "profile" && renderProfileTab()}
        </main>
      </div>
    </div>
  )
}
