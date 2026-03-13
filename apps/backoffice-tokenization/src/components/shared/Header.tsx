import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between items-center w-full px-5 py-4 sm:px-6">
      <Link href="/">
        <Image src="/interactuar_logo.png" alt="logo" width={160} height={32} priority style={{ objectFit: "contain" }} />
      </Link>
    </header>
  );
};
