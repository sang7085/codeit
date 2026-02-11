import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="inner">
        <h1 className="logo">
          <Link href="/"></Link>
        </h1>
      </div>
    </header>
  );
}
