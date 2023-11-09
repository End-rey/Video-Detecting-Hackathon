import cl from './Navbar.module.css'
import React from "react";


const Navbar = ({children}) => {
  return (
      <nav className={cl.navbar}>
        {children}
      </nav>

      );
};

export default Navbar;