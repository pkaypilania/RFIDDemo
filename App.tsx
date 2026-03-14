import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dashboard from './src/screens/dashboard';

function App() {
  return (
    <SafeAreaProvider>
      <Dashboard />
    </SafeAreaProvider>
  );
}

export default App;
