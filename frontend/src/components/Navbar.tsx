import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <form className="form-inline">
        <NavLink to="/" className="btn btn-outline-success">Home</NavLink>
        <NavLink to="/my-collection" className="btn btn-outline-success">Ma Collection</NavLink>
        <NavLink to="/booster" className="btn btn-outline-success">Booster</NavLink>
      </form>
    </nav>
  );
};

export default Navbar;