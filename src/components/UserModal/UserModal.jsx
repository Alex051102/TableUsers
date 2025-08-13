import './UserModal.css';
export const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="user-details">
          <h2>
            {user.firstName} {user.lastName}
          </h2>

          <div className="user-grid">
            <div className="user-section">
              <h3>Основная информация</h3>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Возраст:</strong> {user.age}
              </p>
              <p>
                <strong>Пол:</strong> {user.gender}
              </p>
              <p>
                <strong>Телефон:</strong> {user.phone}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div className="user-section">
              <h3>Адрес</h3>
              <p>
                <strong>Страна:</strong> {user.address?.country}
              </p>
              <p>
                <strong>Город:</strong> {user.address?.city}
              </p>
              <p>
                <strong>Улица:</strong> {user.address?.address}
              </p>
              <p>
                <strong>Индекс:</strong> {user.address?.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
