"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"

export default function LoginPage() {
  const [userType, setUserType] = useState("patient")
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    hospitalId: "",
  })
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulate authentication
    if (credentials.username && credentials.password) {
      localStorage.setItem("userType", userType)
      localStorage.setItem("userId", credentials.username)
      if (userType === "hospital" && credentials.hospitalId) {
        localStorage.setItem("hospitalId", credentials.hospitalId)
      }

      if (userType === "patient") {
        router.push("/patient-dashboard")
      } else {
        router.push("/hospital-dashboard")
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>HealthChain</h1>
          <p>Secure Health Records on ICP Blockchain</p>
        </div>

        <div className={styles.userTypeSelector}>
          <button
            type="button"
            className={`${styles.typeButton} ${userType === "patient" ? styles.active : ""}`}
            onClick={() => setUserType("patient")}
          >
            Patient Login
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${userType === "hospital" ? styles.active : ""}`}
            onClick={() => setUserType("hospital")}
          >
            Hospital Login
          </button>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">{userType === "patient" ? "Patient ID" : "Staff ID"}</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder={userType === "patient" ? "Enter your patient ID" : "Enter your staff ID"}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          {userType === "hospital" && (
            <div className={styles.inputGroup}>
              <label htmlFor="hospitalId">Hospital ID</label>
              <input
                type="text"
                id="hospitalId"
                value={credentials.hospitalId}
                onChange={(e) => setCredentials({ ...credentials, hospitalId: e.target.value })}
                placeholder="Enter hospital ID"
                required
              />
            </div>
          )}

          <button type="submit" className={styles.loginButton}>
            Login to HealthChain
          </button>
        </form>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.icon}>🔒</span>
            <span>Blockchain Secured</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>🏥</span>
            <span>Hospital Integration</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>📱</span>
            <span>Patient Access</span>
          </div>
        </div>
      </div>
    </div>
  )
}
