import { Sun, Moon, User, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Header = () => {
  const { userRole, setUserRole, darkMode, setDarkMode } = useApp()

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.body.classList.remove('light-mode')
      document.documentElement.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
      document.documentElement.classList.add('light-mode')
    }
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-colors duration-300 ${
      darkMode 
        ? 'border-slate-800 bg-slate-900/95' 
        : 'border-gray-200 bg-white/95'
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Finance Dashboard
            </h1>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Track your finances
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
            darkMode 
              ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' 
              : 'border-gray-300 bg-gray-100 hover:border-gray-400'
          }`}>
            {userRole === 'admin' ? (
              <Shield size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            ) : (
              <User size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            )}
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className={`bg-transparent text-sm font-medium outline-none cursor-pointer ${
                darkMode ? 'text-slate-200' : 'text-gray-900'
              }`}
            >
              <option value="viewer" className={darkMode ? 'bg-slate-800' : 'bg-white'}>Viewer</option>
              <option value="admin" className={darkMode ? 'bg-slate-800' : 'bg-white'}>Admin</option>
            </select>
          </div>

          <button 
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
              darkMode 
                ? 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-200' 
                : 'border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400 hover:text-gray-900'
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
