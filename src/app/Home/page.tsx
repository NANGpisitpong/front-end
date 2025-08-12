'use client';import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './home.css'; // ไฟล์ css ที่เราจะเขียนด้านล่าง

export default function Carousel3D() {
  
  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">Hot trend</h2>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 55,
          stretch: 0,
          depth: 150,
          modifier: 1.8,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide className="slide">
          <Image src="/images/01.jpg" alt="Slide 1" width={400} height={500} />
          <div className="slide-caption">XAUUSD - Gold</div>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <Image src="/images/02.png" alt="Slide 2" width={400} height={500} />
          <div className="slide-caption">BTC - Bitcoin</div>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <Image src="/images/03.jpg" alt="Slide 3" width={400} height={500} />
          <div className="slide-caption">US500 - S&P 500</div>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <Image src="/images/04.png" alt="Slide 4" width={400} height={500} />
          <div className="slide-caption">ETH - Ethereum</div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
