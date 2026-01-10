import { SwiperSlide } from 'swiper/react';
import { Swiper } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import HeroSlide from './HeroSlide';

const HeroSlider = ({ items = [] }) => {
  if (!items.length) return null;
  console.log('itemslength', items.length)

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      loop
      autoplay={{ delay: 5000 }}
      navigation
      pagination={{ clickable: true }}
      className="md:h-[50vh] h-[40vh]"
    >
      {items.map((item) => (
        <SwiperSlide key={`${item.media_type}-${item.id}`}>
          <HeroSlide item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
