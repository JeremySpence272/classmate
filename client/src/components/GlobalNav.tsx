import React from "react";
import Logo from "./Logo";

interface GlobalNavProps {
  children?: React.ReactNode;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ children }) => {
  return (
    <div className="w-2/3 mx-auto pt-8 flex  items-center">
      <Logo />
      <div className="flex w-full items-center gap-4">{children}</div>
    </div>
  );
};

export default GlobalNav;
