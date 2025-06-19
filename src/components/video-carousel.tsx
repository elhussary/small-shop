"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const VideoCarousel = ({ companies }: { companies: Company[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handlePlayPause = () => {
    const video = videoRefs.current[currentSlide];
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative h-screen">
      <Carousel className="h-full">
        <CarouselContent className="h-full">
          {companies.map((company, index) => (
            <CarouselItem key={company.id} className="relative h-full">
              <video
                ref={(el) => {
                  if (el) videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover"
                src={company.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                onPlay={() => {
                  setCurrentSlide(index);
                  setIsPlaying(true);
                }}
                onPause={() => {
                  setIsPlaying(false);
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-6">
                  <h2 className="text-6xl font-bold mb-6 animate-fade-in">
                    {company.name}
                  </h2>
                  <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
                    {company.description}
                  </p>

                  <Link href={`/company/${company.slug}/products`} passHref>
                    <Button size="lg" className="text-lg font-semibold">
                      {company.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-6 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="right-6 top-1/2 transform -translate-y-1/2" />

        {/* Play/Pause Button */}
        <Button
          onClick={handlePlayPause}
          className="absolute bottom-6 right-6 rounded-full p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </Button>
      </Carousel>
    </section>
  );
};

export default VideoCarousel;
