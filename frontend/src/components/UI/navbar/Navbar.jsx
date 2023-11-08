
import cl from './Navbar.module.css'
import MyButton from "../button/MyButton";
import React from "react";
import {Link} from "react-router-dom";


const Navbar = ({children}) => {
  return (
      <nav className={cl.navbar}>
        {children}
      </nav>

      );
};

export default Navbar;