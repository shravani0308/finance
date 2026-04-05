import { useState } from 'react'
import Header from './Header'
import SummaryCards from './SummaryCards'
import Charts from './Charts'
import TransactionsList from './TransactionsList'
import Insights from './Insights'
import AddTransactionModal from './AddTransactionModal'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
  const { userRole, darkMode } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <SummaryCards />
          <Charts />
          <TransactionsList onAddClick={() => setShowAddModal(true)} />
          <Insights />
        </div>
      </main>

      {showAddModal && userRole === 'admin' && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

export default Dashboard
