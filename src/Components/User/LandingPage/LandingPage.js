import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiRequest } from "../../Utils/api";
import Header from "./Header"; 
import { useSelector } from "react-redux";
import Footer from "../Footer/Footer";
import MovieCard from "./MovieCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [banners, setBanners] = useState([]);
  const location = useSelector((state) => state.location.location);  
  console.log("location ",location)
  const baseUrl = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    const fetchMovies = async () => {
    const response = await apiRequest(
      "GET",
      "/fetchNovwShowingMovies",
      {},
      {},
      { location } 
    );

    if (response.success) {
      setMovies(response.data || []);
    } else {
      console.error("Error fetching movies:", response.message);
    }
  };

  const fetchBanners = async () => {
    const response = await apiRequest("GET", "/getBannerImages");

    if (response.success) {
      setBanners(response.data || []);
    } else {
      console.error("Error fetching banners:", response.message);
    }
  };

  fetchMovies();
  fetchBanners();
  }, [location]);
  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> 
      <div className="flex-grow p-4 m-4">
      <div className="relative h-64 mb-8">
          <Slider {...bannerSettings}>
            {banners.map((banner) => (
              <div key={banner._id}>
                <img
                  src={`${banner.bannerUrl}`}
                  alt="Banner"
                  className="w-full h-72 object-cover rounded-md"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Recommended Movies</h2>
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie._id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
