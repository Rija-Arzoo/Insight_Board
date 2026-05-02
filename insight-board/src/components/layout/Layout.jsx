import Sidebar from "./Sidebar";
import Header from "./Header";
import { MobileNavProvider } from "./MobileNavContext";

function Layout({ children }) {
  return (
    <MobileNavProvider>
      <div className="flex min-h-dvh min-w-0 bg-transparent text-[color:var(--text)]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pb-6 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}

export default Layout;