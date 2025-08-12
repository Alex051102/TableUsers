import { useState } from 'react';
import { Table } from './components/Table/Table';
import { UserModal } from './components/Table/UserModal';

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
      <h1>Список пользователей</h1>
      <Table setToModal={setToModal} />
    </div>
  );
}

export default App;
