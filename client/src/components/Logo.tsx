import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link className="absolute top-7 left-6" href="/">
      <h1
        className={`text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-600 px-4 relative ${className}`}
      >
        <span className="opacity-20 absolute -left-1 w-full h-full bg-zinc-200 rounded-xl blur-lg"></span>
        classmate
        <span className="z-[-1] absolute -left-1 w-full h-full bg-zinc-700 rounded-xl blur-lg"></span>
      </h1>
    </Link>
  );
};

export default Logo;
