import { Table } from './components/Table/Table';

function App() {
  fetch('https://dummyjson.com/users/filter?key=hair.color&value=Brown&key=age&value=25')
    .then((res) => res.json())
    .then(console.log);
  return (
    <div className="app">
      <h1>Список пользователей</h1>
      <Table />
    </div>
  );
}

export default App;
