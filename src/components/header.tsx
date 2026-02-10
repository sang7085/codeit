import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="inner">
        <h1>
          <Link href="/">
            <Image
              src="/assets/images/logo.svg"
              alt="로고"
              width={150}
              height={40}
            />
          </Link>
        </h1>
      </div>
    </header>
  );
}
