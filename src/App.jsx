import { useState } from 'react';
import { Table } from './components/Table/Table';
import { UserModal } from './components/UserModal/UserModal';

function App() {
  const [userData, setUserData] = useState(null);
  function setToModal(user) {
    setUserData(user);
  }
  {
    userData && <UserModal user={userData} onClose={() => setUserData(null)} />;
  }
  return (
    <div className="app">
      {userData && <UserModal user={userData} onClose={() => setUserData(null)} />}

      <Table setToModal={setToModal} />
    </div>
  );
}

export default App;
