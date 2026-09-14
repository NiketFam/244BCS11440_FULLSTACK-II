import React from 'react';

// Shared Component
import Navbar from './components/shared/Navbar';

// Prop Drilling Version
import Homepd from './components/propdrilling/Homepd';

// Context API Version
import { UserContext } from './context/UserContext';
import Homecontextapi from './components/contextapi/Homecontextapi';

export default function App() {
  const user = {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    location: "Seattle, WA"
  };

  return (
    <div>
      <Navbar />

      <div>
        {/* VERSION 1: PROP DRILLING */}
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Version 1: Prop Drilling</h2>
          <Homepd user={user} />
        </div>

        {/* VERSION 2: CONTEXT API */}
        <div>
          <h2>Version 2: Context API</h2>
          <UserContext.Provider value={user}>
            <Homecontextapi />
          </UserContext.Provider>
        </div>
      </div>
    </div>
  );
}