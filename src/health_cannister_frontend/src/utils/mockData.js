// Simple utility functions for mock data - no classes!

// Generate a simple blockchain hash
export function generateBlockchainHash() {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 15)
  return `0x${timestamp.slice(-8)}${random}`
}

// Get mock patient records
export function getMockPatientRecords(patientId = "P001") {
  return [
    {
      id: "R001",
      patientId: patientId,
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
      blockchainHash: generateBlockchainHash(),
      verified: true,
    },
    {
      id: "R002",
      patientId: patientId,
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
      blockchainHash: generateBlockchainHash(),
      verified: true,
    },
    {
      id: "R003",
      patientId: patientId,
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
      blockchainHash: generateBlockchainHash(),
      verified: true,
    },
  ]
}

// Get mock patient info
export function getMockPatientInfo() {
  return {
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
  }
}

// Get mock patients list
export function getMockPatients() {
  return [
    { id: "P001", name: "John Doe", age: 35, bloodType: "O+", lastVisit: "2024-03-10" },
    { id: "P002", name: "Jane Smith", age: 28, bloodType: "A-", lastVisit: "2024-03-08" },
    { id: "P003", name: "Robert Johnson", age: 45, bloodType: "B+", lastVisit: "2024-03-05" },
    { id: "P004", name: "Emily Davis", age: 32, bloodType: "AB+", lastVisit: "2024-03-03" },
    { id: "P005", name: "Michael Brown", age: 52, bloodType: "O-", lastVisit: "2024-03-01" },
  ]
}
