import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
  dark?: boolean;
};

const Logo = ({ className, dark }: LogoProps) => (
  <Link className={`flex items-center gap-2 ${className}`} to="/">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-1">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 19h20L12 2z" />
        <path d="M12 10v4" />
      </svg>
    </div>
    <span className="font-inter text-xl font-bold tracking-tight text-n-1">
      Alem
    </span>
  </Link>
);

export default Logo;
