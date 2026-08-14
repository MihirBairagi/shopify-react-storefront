import {
  Swiper,
  SwiperSlide
} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Navigation,
  Pagination
} from "swiper/modules";


function Slider({ slides }) {

  return (

    <Swiper
      modules={[
        Navigation,
        Pagination
      ]}
      navigation
      pagination={{
        clickable: true
      }}
      spaceBetween={30}
      slidesPerView={1}
    >

      {slides.map((slide) => (

        <SwiperSlide key={slide.id}>

          <div className="slide">

            <div className="slide-image">

              <img
                src={slide.image}
                alt={slide.title}
              />

            </div>


            <div className="slide-content">

              <h3>
                {slide.title}
              </h3>

              <p>
                {slide.description}
              </p>

            </div>

          </div>

        </SwiperSlide>

      ))}

    </Swiper>

  );

}

export default Slider;