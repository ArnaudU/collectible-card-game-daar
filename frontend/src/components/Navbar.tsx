import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-light bg-white">
      <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '15px' }} />
      <form className="form-inline">
        <NavLink to="/" className="btn btn-outline-danger">Home</NavLink>
        <NavLink to="/my-collection" className="btn btn-outline-danger">Ma Collection</NavLink>
        <NavLink to="/booster" className="btn btn-outline-danger">Booster</NavLink>
      </form>
    </nav>
  );
};

export default Navbar;