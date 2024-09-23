import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const images = [
  "/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png",
]


export const ImageCarousel = () => {

  return (
    <div className="flex w-full justify-center items-center">
      <Carousel className="w-full max-w-[80%] border-[#69a03a] border-2 outline-none"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full">
              <img
                src={image}
                alt={`Carousel Main Image ${index + 1}`}
                style={{ objectFit: "cover" }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div >
  )
}
