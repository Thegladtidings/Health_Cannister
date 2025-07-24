use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum ApiResponse {
    Ok(String),
    Err(String),
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Hospital {
    pub id: String,
    pub hospital_name: String,
    pub hospital_type: String,
    pub license_number: String,
    pub address: String,
    pub city: String,
    pub state: String,
    pub zip_code: String,
    pub phone: String,
    pub email: String,
    pub website: String,

    pub admin_name: String,
    pub admin_title: String,
    pub admin_email: String,
    pub admin_phone: String,

    pub username: String,
    pub password: String,

    pub medical_license: String,
    pub hospital_registration: String,

    pub agree_to_terms: bool,
    pub agree_to_privacy: bool,
    pub verify_information: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PatientAccount {
    // Personal Info
    pub full_name: String,
    pub date_of_birth: String,
    pub gender: String,
    pub blood_type: String,
    pub phone: String,
    pub email: String,
    pub address: String,

    // Account Info
    pub username: String,
    pub password: String, // consider hashing it in real apps

    // Emergency Contact
    pub emergency_contact_name: String,
    pub emergency_contact_phone: String,
    pub emergency_contact_relation: String,

    // Insurance Info
    pub insurance_provider: String,
    pub insurance_policy_number: String,
    pub insurance_group_number: String,

    // Medical Info
    pub allergies: String,
    pub chronic_conditions: String,
    pub current_medications: String,

    // Agreements
    pub agreed_to_terms: bool,
    pub agreed_to_privacy: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Patient {
    pub id: String,
    pub name: String,
    pub date_of_birth: String,
    pub gender: String,
    pub blood_type: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub emergency_contact_name: String,
    pub emergency_contact_phone: String,
    pub emergency_contact_relation: String,
    pub insurance_provider: String,
    pub insurance_policy_number: String,
    pub allergies: String,
    pub chronic_conditions: String,
    pub current_medications: String,
    pub age: u8,
    pub last_visit: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VitalSigns {
    pub blood_pressure: String,
    pub heart_rate: String,
    pub temperature: String,
    pub respiratory_rate: String,
    pub oxygen_saturation: String,
    pub weight: String,
    pub height: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MedicalRecord {
    pub id: String,
    pub patient_id: String,
    pub date: String,
    pub hospital: String,
    pub doctor: String,
    pub department: String,
    pub visit_type: String,
    pub chief_complaint: String,
    pub diagnosis: String,
    pub treatment: String,
    pub medications: Vec<String>,
    pub vital_signs: VitalSigns,
    pub lab_results: Vec<String>,
    pub notes: String,
    pub follow_up: String,
    pub blockchain_hash: String,
    pub verified: bool,
}
