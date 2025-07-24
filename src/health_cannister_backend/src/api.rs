use crate::model::{Patient, MedicalRecord,PatientAccount,Hospital, ApiResponse};
use crate::storage::{PATIENTS, HOSPITALS,PATIENT_ACCOUNTS, MEDICAL_RECORDS};
use ic_cdk::{update, query};
use ic_cdk::println;

// Register a hospital
#[update]
pub fn register_hospital(hospital: Hospital) -> String {
    println!("Registering hospital: {:?}", hospital.hospital_name);

    if hospital.license_number.trim().is_empty() {
        return "License number is required.".to_string();
    }

    HOSPITALS.with(|h| {
        h.borrow_mut().insert(hospital.license_number.clone(), hospital);
    });

    "Hospital registered successfully.".to_string()
}

// Get hospital by license number
#[query]
pub fn get_hospital(license_number: String) -> Option<Hospital> {
    HOSPITALS.with(|h| h.borrow().get(&license_number).cloned())
}

// Optional: Get all registered hospitals
#[query]
pub fn list_hospitals() -> Vec<Hospital> {
    HOSPITALS.with(|h| h.borrow().values().cloned().collect())
}

// Optional: Check if a hospital is registered
#[query]
pub fn is_hospital_registered(license_number: String) -> bool {
    HOSPITALS.with(|h| h.borrow().contains_key(&license_number))
}

// Optional: Delete a hospital
#[update]
pub fn delete_hospital(license_number: String) -> String {
    HOSPITALS.with(|h| {
        let mut hospitals = h.borrow_mut();
        if hospitals.remove(&license_number).is_some() {
            "Hospital deleted.".to_string()
        } else {
            "Hospital not found.".to_string()
        }
    })
}


#[update]
pub fn register_patient_account(account: PatientAccount) ->ApiResponse {
    // Validation
    if !account.agreed_to_terms || !account.agreed_to_privacy {
        return ApiResponse::Err("You must agree to terms and privacy policy.".into());
    }

    if account.password.len() < 6 {
        return ApiResponse::Err("Password must be at least 6 characters long.".into());
    }

    let username = account.username.clone();

    // Check for duplicates
    let exists = PATIENT_ACCOUNTS.with(|accs| accs.borrow().contains_key(&username));
    if exists {
        return ApiResponse::Err("Username already taken.".into());
    }

    // Save account
    PATIENT_ACCOUNTS.with(|accs| {
        accs.borrow_mut().insert(username.clone(), account);
    });

    ApiResponse::Ok(format!("Patient account '{}' registered successfully", username))
}


#[update]
pub fn add_patient(patient: Patient) -> Result<Patient, String> {
    let id = patient.id.clone();
    let email = patient.email.clone();

    let exists = PATIENTS.with(|p| p.borrow().values().any(|x| x.email == email));
    if exists {
        return Err("Patient with this email already exists".into());
    }

    PATIENTS.with(|patients| {
        patients.borrow_mut().insert(id.clone(), patient.clone());
    });

    Ok(patient)
}

#[query]
pub fn get_all_patients() -> Vec<Patient> {
    PATIENTS.with(|patients| patients.borrow().values().cloned().collect())
}

#[update]
pub fn add_patient_record(record: MedicalRecord) -> Result<MedicalRecord, String> {
    let patient_id = record.patient_id.clone();

    let patient_exists = PATIENTS.with(|p| p.borrow().contains_key(&patient_id));
    if !patient_exists {
        return Err(format!("Patient with ID {} not found", patient_id));
    }

    MEDICAL_RECORDS.with(|records| {
        let mut map = records.borrow_mut();
        let entry = map.entry(patient_id).or_insert_with(Vec::new);
        entry.push(record.clone());
    });

    Ok(record)
}

#[query]
pub fn get_patient_records(patient_id: String) -> Vec<MedicalRecord> {
    MEDICAL_RECORDS.with(|records| {
        records
            .borrow()
            .get(&patient_id)
            .cloned()
            .unwrap_or_else(Vec::new)
    })
}
