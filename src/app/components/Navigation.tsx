"use client";
import Link from 'next/link';
import { useEffect } from 'react';


export default function Navigation() {
  useEffect(() => {
    // @ts-ignore
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" lang="th">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src="/bootstrap-logo.svg" alt="Logo" width={30} height={24} className="d-inline-block align-text-top" />
          Bootstrap
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/service">Service</Link>
            </li> 
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={e => e.preventDefault()}
              >
                Contect
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" href="https://www.facebook.com/">Facebook</Link></li>
                <li><Link className="dropdown-item" href="https://www.line.me/en/">line</Link></li>
               
            
              </ul>
            </li>
        
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}