import Sidebar from "./Sidebar"
import Header from "./Header"

function Layout({ children }) {

  return (
    <div className="flex min-h-screen bg-transparent text-[color:var(--text)]">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  )
}

export default Layout