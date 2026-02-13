import { SecurityProvider } from './features/exam-security/context/SecurityContext';
import SecureTestPage from './features/exam-security/pages/SecureTestPage';

function App() {
    return (
        <SecurityProvider>
            <SecureTestPage />
        </SecurityProvider>
    );
}

export default App;
