'use client';
import { useEffect } from 'react';
import Image from "next/image";


export default function Carousel() {
  useEffect(() => {
    // @ts-ignore
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
    <div id="carouselExample" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <Image src="/images/01.jpg" className="d-block w-100" alt="..." width={1024} height={768} />
        </div>
        <div className="carousel-item">
          <Image src="/images/02.png" className="d-block w-100" alt="..." width={1024} height={768} />
        </div>
        <div className="carousel-item">
          <Image src="/images/03.jpg" className="d-block w-100" alt="..." width={1024} height={768} />
        </div>
        <div className="carousel-item">
          <Image src="/images/04.png" className="d-block w-100" alt="..." width={1024} height={768} />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}