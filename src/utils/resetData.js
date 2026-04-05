// Utility to reset all data to demo state
// Run this in browser console: window.resetFinanceData()

export const resetFinanceData = () => {
  localStorage.removeItem('transactions')
  localStorage.removeItem('userRole')
  localStorage.removeItem('darkMode')
  window.location.reload()
}

// Make it available globally for easy access
if (typeof window !== 'undefined') {
  window.resetFinanceData = resetFinanceData
}
