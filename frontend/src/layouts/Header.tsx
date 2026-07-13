import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">To Dentists</div>
        <nav className="nav-menu">
          <Link href="/booking" className="nav-link nav-cta">จองคิว</Link>
        </nav>
      </div>
    </header>
  );
}
