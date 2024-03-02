const Profile = ({ onLogout }) => {

  return (
    <div>
      <button onClick={onLogout}>
        Sign out
      </button>
    </div>
  );
};




export default Profile;