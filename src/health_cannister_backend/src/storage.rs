use crate::model::{Patient, MedicalRecord,Hospital,PatientAccount};
use std::collections::HashMap;
use std::cell::RefCell;



thread_local! {
    pub static PATIENTS: RefCell<HashMap<String, Patient>> = RefCell::new(HashMap::new());
    pub static MEDICAL_RECORDS: RefCell<HashMap<String, Vec<MedicalRecord>>> = RefCell::new(HashMap::new());
    pub static PATIENT_ACCOUNTS: RefCell<HashMap<String, PatientAccount>> = RefCell::new(HashMap::new());
    pub static HOSPITALS: RefCell<HashMap<String, Hospital>> = RefCell::new(HashMap::new());

}
