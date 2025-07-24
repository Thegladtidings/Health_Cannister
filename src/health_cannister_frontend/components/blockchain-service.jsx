// Simulated ICP Blockchain Service
export class BlockchainService {
  static instance = null
  records = new Map()

  static getInstance() {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService()
    }
    return BlockchainService.instance
  }

  // Simulate storing a record on ICP blockchain
  async storeRecord(record) {
    const hash = this.generateHash(record)
    const blockchainRecord = {
      ...record,
      hash,
      timestamp: Date.now(),
      verified: true,
      immutable: true,
    }

    this.records.set(record.id, blockchainRecord)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return hash
  }

  // Simulate retrieving records from ICP blockchain
  async getPatientRecords(patientId) {
    const patientRecords = Array.from(this.records.values())
      .filter((record) => record.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return patientRecords
  }

  // Simulate verifying record integrity
  async verifyRecord(recordId) {
    const record = this.records.get(recordId)
    if (!record) return false

    const currentHash = this.generateHash({
      ...record,
      hash: undefined,
      timestamp: undefined,
    })

    return currentHash === record.hash
  }

  generateHash(data) {
    // Simple hash simulation - in real implementation, use proper cryptographic hash
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `0x${Math.abs(hash).toString(16).padStart(20, "0")}`
  }

  // Simulate getting blockchain network status
  async getNetworkStatus() {
    return {
      connected: true,
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      networkHealth: "good",
    }
  }
}

export default BlockchainService
