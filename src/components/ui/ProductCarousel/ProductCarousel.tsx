import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { IDetalleDTO } from "../../../types/detalles/IDetalleDTO";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ProductCarousel.module.css";
import CardProducts from "../CardProducts/CardProducts";

interface IProps {
  products: IDetalleDTO[];
}

const ProductCarousel: FC<IProps> = ({ products }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      className={styles.swiperContainer}
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
    >
      {products?.map((product) => (
        <SwiperSlide key={product.id} className={styles.swiperSlide}>
          <CardProducts products={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCarousel;
