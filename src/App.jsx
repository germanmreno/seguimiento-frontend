import { NavBar } from "./NavBar"
import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <AuthProvider>
      <NavBar />
    </AuthProvider>
  )
}

export default App
