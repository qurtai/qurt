import { Link } from "react-router-dom";
import Image from "@/components/Image";

type TestProps = {
    className?: string;
    dark?: boolean;
};

const Test = ({ className, dark }: TestProps) => (
    <Link className={`flex w-[11.88rem] ${className}`} to="/">
        <Image
            className="w-full h-auto"
            src={dark ? "/images/logo-dark.svg" : "/images/logo.svg"}
            width={190}
            height={40}
            alt="Alem"
        />
    </Link>
);

export default Test;
