import React from "react"
import { useState } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { createActor as createBackendActor }  from "../../../declarations/health_cannister_backend";

import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "./RegisterPage.module.css"

function RegisterPage() {
    const [searchParams] = useSearchParams()
    const userType = searchParams.get("type") || "patient"
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    // Patient registration form
    const [patientData, setPatientData] = useState({
        // Personal Information
        fullName: "",
        dateOfBirth: "",
        gender: "Male",
        bloodType: "O+",
        phone: "",
        email: "",
        address: "",

        // Account Information
        username: "",
        password: "",
        confirmPassword: "",

        // Emergency Contact
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",

        // Insurance Information
        insuranceProvider: "",
        insurancePolicyNumber: "",
        insuranceGroupNumber: "",

        // Medical Information
        allergies: "",
        chronicConditions: "",
        currentMedications: "",

        // Terms and Privacy
        agreeToTerms: false,
        agreeToPrivacy: false,
    })

    // Hospital registration form
    const [hospitalData, setHospitalData] = useState({
        // Hospital Information
        hospitalName: "",
        hospitalType: "General Hospital",
        licenseNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        website: "",

        // Administrator Information
        adminName: "",
        adminTitle: "Administrator",
        adminEmail: "",
        adminPhone: "",

        // Account Information
        username: "",
        password: "",
        confirmPassword: "",

        // Verification Documents
        medicalLicense: "",
        hospitalRegistration: "",

        // Terms and Privacy
        agreeToTerms: false,
        agreeToPrivacy: false,
        verifyInformation: false,
    })

    const validateForm = () => {
        const data = userType === "patient" ? patientData : hospitalData

        // Check required fields
        if (!data.username || !data.password || !data.confirmPassword) {
            setError("Please fill in all required account information")
            return false
        }

        // Check password match
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match")
            return false
        }

        // Check password strength
        if (data.password.length < 8) {
            setError("Password must be at least 8 characters long")
            return false
        }

        // Check terms agreement
        if (!data.agreeToTerms || !data.agreeToPrivacy) {
            setError("Please agree to the Terms of Service and Privacy Policy")
            return false
        }

        // Patient-specific validation
        if (userType === "patient") {
            if (!patientData.fullName || !patientData.dateOfBirth || !patientData.email) {
                setError("Please fill in all required personal information")
                return false
            }
        }

        // Hospital-specific validation
        if (userType === "hospital") {
            if (!hospitalData.hospitalName || !hospitalData.licenseNumber || !hospitalData.adminName) {
                setError("Please fill in all required hospital information")
                return false
            }
            if (!hospitalData.verifyInformation) {
                setError("Please verify that all information provided is accurate")
                return false
            }
        }

        return true
    }


    // Assume this state is set somewhere

    const handleSubmit = async (event) => {
          event.preventDefault(); // 🔥 prevents the default form reload behavior

        console.log("hi first")
        try {
            const authClient = await AuthClient.create()
            await authClient.login({
                identityProvider:
                    import.meta.env.VITE_DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://${import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
                derivationOrigin: window.location.origin,
                onCancel: () => {
                    console.log("Login cancelled")
                    setError("Login cancelled.")
                    setLoading(false)
                },
                onSuccess: async () => {
                    console.log("hi")
                    const identity = authClient.getIdentity()
                    const principal = identity.getPrincipal().toText()
                    console.log(principal);
                    const backend = createBackendActor(import.meta.env.VITE_CANISTER_ID_HEALTH_CANNISTER_BACKEND, {
                        agentOptions: { identity },
                    });

                    if (userType === "patient") {
                        await backend.register_patient_account({
                            full_name: patientData.fullName,
                            date_of_birth: patientData.dateOfBirth,
                            gender: patientData.gender,
                            blood_type: patientData.bloodType,
                            phone: patientData.phone,
                            email: patientData.email,
                            address: patientData.address,
                            username: patientData.username,
                            password: patientData.password,
                            emergency_contact_name: patientData.emergencyContactName,
                            emergency_contact_phone: patientData.emergencyContactPhone,
                            emergency_contact_relation: patientData.emergencyContactRelation,
                            insurance_provider: patientData.insuranceProvider,
                            insurance_policy_number: patientData.insurancePolicyNumber,
                            insurance_group_number: patientData.insuranceGroupNumber,
                            allergies: patientData.allergies,
                            chronic_conditions: patientData.chronicConditions,
                            current_medications: patientData.currentMedications,
                            agreed_to_terms: patientData.agreeToTerms,
                            agreed_to_privacy: patientData.agreeToPrivacy,
                        });
                    } else if (userType === "hospital") {
                        await backend.register_hospital({
                            hospital_name: hospitalData.hospitalName,
                            hospital_type: hospitalData.hospitalType,
                            license_number: hospitalData.licenseNumber,
                            address: hospitalData.address,
                            city: hospitalData.city,
                            state: hospitalData.state,
                            zip_code: hospitalData.zipCode,
                            phone: hospitalData.phone,
                            email: hospitalData.email,
                            website: hospitalData.website,
                            admin_name: hospitalData.adminName,
                            admin_title: hospitalData.adminTitle,
                            admin_email: hospitalData.adminEmail,
                            admin_phone: hospitalData.adminPhone,
                            username: hospitalData.username,
                            password: hospitalData.password,
                            medical_license: hospitalData.medicalLicense,
                            hospital_registration: hospitalData.hospitalRegistration,
                            agree_to_terms: hospitalData.agreeToTerms,
                            agree_to_privacy: hospitalData.agreeToPrivacy,
                            verify_information: hospitalData.verifyInformation,
                        });
                    }
                    alert("Registration successful!");
                }
            })
        } catch (err) {
            console.error("Blockchain registration failed:", err);
            alert("Registration failed. Please try again.");

        }
    };



    const renderPatientForm = () => (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Personal Information Section */}
            <div className={styles.formSection}>
                <h3>Personal Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                            type="text"
                            id="fullName"
                            value={patientData.fullName}
                            onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="dateOfBirth">Date of Birth *</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={patientData.dateOfBirth}
                            onChange={(e) => setPatientData({ ...patientData, dateOfBirth: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            value={patientData.gender}
                            onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="bloodType">Blood Type</label>
                        <select
                            id="bloodType"
                            value={patientData.bloodType}
                            onChange={(e) => setPatientData({ ...patientData, bloodType: e.target.value })}
                        >
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="Unknown">Unknown</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            value={patientData.phone}
                            onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            value={patientData.email}
                            onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        value={patientData.address}
                        onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                        placeholder="Enter your full address"
                        rows={2}
                    />
                </div>
            </div>

            {/* Account Information Section */}
            <div className={styles.formSection}>
                <h3>Account Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            value={patientData.username}
                            onChange={(e) => setPatientData({ ...patientData, username: e.target.value })}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            value={patientData.password}
                            onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={patientData.confirmPassword}
                            onChange={(e) => setPatientData({ ...patientData, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Emergency Contact Section */}
            <div className={styles.formSection}>
                <h3>Emergency Contact</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="emergencyContactName">Contact Name</label>
                        <input
                            type="text"
                            id="emergencyContactName"
                            value={patientData.emergencyContactName}
                            onChange={(e) => setPatientData({ ...patientData, emergencyContactName: e.target.value })}
                            placeholder="Emergency contact name"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="emergencyContactPhone">Contact Phone</label>
                        <input
                            type="tel"
                            id="emergencyContactPhone"
                            value={patientData.emergencyContactPhone}
                            onChange={(e) => setPatientData({ ...patientData, emergencyContactPhone: e.target.value })}
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="emergencyContactRelation">Relationship</label>
                    <input
                        type="text"
                        id="emergencyContactRelation"
                        value={patientData.emergencyContactRelation}
                        onChange={(e) => setPatientData({ ...patientData, emergencyContactRelation: e.target.value })}
                        placeholder="e.g., Spouse, Parent, Sibling"
                    />
                </div>
            </div>

            {/* Insurance Information Section */}
            <div className={styles.formSection}>
                <h3>Insurance Information (Optional)</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="insuranceProvider">Insurance Provider</label>
                        <input
                            type="text"
                            id="insuranceProvider"
                            value={patientData.insuranceProvider}
                            onChange={(e) => setPatientData({ ...patientData, insuranceProvider: e.target.value })}
                            placeholder="Insurance company name"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="insurancePolicyNumber">Policy Number</label>
                        <input
                            type="text"
                            id="insurancePolicyNumber"
                            value={patientData.insurancePolicyNumber}
                            onChange={(e) => setPatientData({ ...patientData, insurancePolicyNumber: e.target.value })}
                            placeholder="Policy number"
                        />
                    </div>
                </div>
            </div>

            {/* Medical Information Section */}
            <div className={styles.formSection}>
                <h3>Medical Information (Optional)</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="allergies">Known Allergies</label>
                    <textarea
                        id="allergies"
                        value={patientData.allergies}
                        onChange={(e) => setPatientData({ ...patientData, allergies: e.target.value })}
                        placeholder="List any known allergies (comma-separated)"
                        rows={2}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="chronicConditions">Chronic Conditions</label>
                    <textarea
                        id="chronicConditions"
                        value={patientData.chronicConditions}
                        onChange={(e) => setPatientData({ ...patientData, chronicConditions: e.target.value })}
                        placeholder="List any chronic conditions (comma-separated)"
                        rows={2}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="currentMedications">Current Medications</label>
                    <textarea
                        id="currentMedications"
                        value={patientData.currentMedications}
                        onChange={(e) => setPatientData({ ...patientData, currentMedications: e.target.value })}
                        placeholder="List current medications (comma-separated)"
                        rows={2}
                    />
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className={styles.formSection}>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={patientData.agreeToTerms}
                            onChange={(e) => setPatientData({ ...patientData, agreeToTerms: e.target.checked })}
                            required
                        />
                        <span>
                            I agree to the{" "}
                            <a href="/terms" target="_blank" rel="noreferrer">
                                Terms of Service
                            </a>{" "}
                            *
                        </span>
                    </label>
                </div>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={patientData.agreeToPrivacy}
                            onChange={(e) => setPatientData({ ...patientData, agreeToPrivacy: e.target.checked })}
                            required
                        />
                        <span>
                            I agree to the{" "}
                            <a href="/privacy" target="_blank" rel="noreferrer">
                                Privacy Policy
                            </a>{" "}
                            *
                        </span>
                    </label>
                </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Creating Account..." : "Create Patient Account"}
            </button>
        </form>
    )

    const renderHospitalForm = () => (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Hospital Information Section */}
            <div className={styles.formSection}>
                <h3>Hospital Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="hospitalName">Hospital Name *</label>
                        <input
                            type="text"
                            id="hospitalName"
                            value={hospitalData.hospitalName}
                            onChange={(e) => setHospitalData({ ...hospitalData, hospitalName: e.target.value })}
                            placeholder="Enter hospital name"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="hospitalType">Hospital Type</label>
                        <select
                            id="hospitalType"
                            value={hospitalData.hospitalType}
                            onChange={(e) => setHospitalData({ ...hospitalData, hospitalType: e.target.value })}
                        >
                            <option value="General Hospital">General Hospital</option>
                            <option value="Specialty Hospital">Specialty Hospital</option>
                            <option value="Teaching Hospital">Teaching Hospital</option>
                            <option value="Children's Hospital">Children's Hospital</option>
                            <option value="Psychiatric Hospital">Psychiatric Hospital</option>
                            <option value="Rehabilitation Hospital">Rehabilitation Hospital</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Urgent Care">Urgent Care</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="licenseNumber">Medical License Number *</label>
                        <input
                            type="text"
                            id="licenseNumber"
                            value={hospitalData.licenseNumber}
                            onChange={(e) => setHospitalData({ ...hospitalData, licenseNumber: e.target.value })}
                            placeholder="Hospital license number"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            value={hospitalData.phone}
                            onChange={(e) => setHospitalData({ ...hospitalData, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        value={hospitalData.address}
                        onChange={(e) => setHospitalData({ ...hospitalData, address: e.target.value })}
                        placeholder="Enter hospital address"
                        rows={2}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Hospital Email</label>
                        <input
                            type="email"
                            id="email"
                            value={hospitalData.email}
                            onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
                            placeholder="hospital@example.com"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="website">Website</label>
                        <input
                            type="url"
                            id="website"
                            value={hospitalData.website}
                            onChange={(e) => setHospitalData({ ...hospitalData, website: e.target.value })}
                            placeholder="https://www.hospital.com"
                        />
                    </div>
                </div>
            </div>

            {/* Administrator Information Section */}
            <div className={styles.formSection}>
                <h3>Administrator Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="adminName">Administrator Name *</label>
                        <input
                            type="text"
                            id="adminName"
                            value={hospitalData.adminName}
                            onChange={(e) => setHospitalData({ ...hospitalData, adminName: e.target.value })}
                            placeholder="Full name of administrator"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="adminTitle">Title</label>
                        <select
                            id="adminTitle"
                            value={hospitalData.adminTitle}
                            onChange={(e) => setHospitalData({ ...hospitalData, adminTitle: e.target.value })}
                        >
                            <option value="Administrator">Administrator</option>
                            <option value="Chief Medical Officer">Chief Medical Officer</option>
                            <option value="Medical Director">Medical Director</option>
                            <option value="IT Director">IT Director</option>
                            <option value="Operations Manager">Operations Manager</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="adminEmail">Administrator Email</label>
                        <input
                            type="email"
                            id="adminEmail"
                            value={hospitalData.adminEmail}
                            onChange={(e) => setHospitalData({ ...hospitalData, adminEmail: e.target.value })}
                            placeholder="admin@hospital.com"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="adminPhone">Administrator Phone</label>
                        <input
                            type="tel"
                            id="adminPhone"
                            value={hospitalData.adminPhone}
                            onChange={(e) => setHospitalData({ ...hospitalData, adminPhone: e.target.value })}
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>
            </div>

            {/* Account Information Section */}
            <div className={styles.formSection}>
                <h3>Account Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            value={hospitalData.username}
                            onChange={(e) => setHospitalData({ ...hospitalData, username: e.target.value })}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            value={hospitalData.password}
                            onChange={(e) => setHospitalData({ ...hospitalData, password: e.target.value })}
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={hospitalData.confirmPassword}
                            onChange={(e) => setHospitalData({ ...hospitalData, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className={styles.formSection}>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={hospitalData.agreeToTerms}
                            onChange={(e) => setHospitalData({ ...hospitalData, agreeToTerms: e.target.checked })}
                            required
                        />
                        <span>
                            I agree to the{" "}
                            <a href="/terms" target="_blank" rel="noreferrer">
                                Terms of Service
                            </a>{" "}
                            *
                        </span>
                    </label>
                </div>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={hospitalData.agreeToPrivacy}
                            onChange={(e) => setHospitalData({ ...hospitalData, agreeToPrivacy: e.target.checked })}
                            required
                        />
                        <span>
                            I agree to the{" "}
                            <a href="/privacy" target="_blank" rel="noreferrer">
                                Privacy Policy
                            </a>{" "}
                            *
                        </span>
                    </label>
                </div>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={hospitalData.verifyInformation}
                            onChange={(e) => setHospitalData({ ...hospitalData, verifyInformation: e.target.checked })}
                            required
                        />
                        <span>I verify that all information provided is accurate and complete *</span>
                    </label>
                </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Creating Account..." : "Create Hospital Account"}
            </button>
        </form>
    )

    return (
        <div className={styles.container}>
            <div className={styles.registerCard}>
                <div className={styles.header}>
                    <h1>Create Account</h1>
                    <p>Join Health Canister - Secure Health Records on ICP Blockchain</p>
                </div>

                <div className={styles.userTypeSelector}>
                    <button
                        type="button"
                        className={`${styles.typeButton} ${userType === "patient" ? styles.active : ""}`}
                        onClick={() => navigate("/register?type=patient")}
                    >
                        Patient Registration
                    </button>
                    <button
                        type="button"
                        className={`${styles.typeButton} ${userType === "hospital" ? styles.active : ""}`}
                        onClick={() => navigate("/register?type=hospital")}
                    >
                        Hospital Registration
                    </button>
                </div>

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
                    </div>
                )}

                {/* Render appropriate form */}
                {userType === "patient" ? renderPatientForm() : renderHospitalForm()}

                <div className={styles.loginLink}>
                    <p>
                        Already have an account?{" "}
                        <a href={`/?type=${userType}`} className={styles.link}>
                            Sign in here
                        </a>
                    </p>
                </div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span className={styles.icon}>🔒</span>
                        <span>Blockchain Secured</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.icon}>🏥</span>
                        <span>HIPAA Compliant</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.icon}>📱</span>
                        <span>Easy Access</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
