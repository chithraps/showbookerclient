import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Dashboard/Navbar";
import swal from "sweetalert";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSuperAdmin } from "../../../Features/AdminActions";

function BannerImage() {
  const [banner, setBanner] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [allBanners, setAllBanners] = useState([]);
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin.adminAccessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchAllBanners = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/admin/getAllBannerImages`,
          {
            headers: {
              Authorization: `Bearer ${adminAccessToken}`,
            },
          }
        );
        setAllBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners", error);
        if (error.response?.data?.message === "Unauthorized: Token has expired") {
          swal({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutSuperAdmin());
              navigate("/admin");
            }
          });
        }
      }
    };

    fetchAllBanners();
  }, [adminAccessToken]);

  const handleFileChange = (e) => {
    setBanner(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bannerImage", banner);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/admin/addBannerImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      if (response.status === 200) {
        swal("Success", response.data.message);
        setImageUrl(response.data.imageUrl);
        setAllBanners((prevBanners) => [...prevBanners, response.data]);
      }
    } catch (error) {
      console.error("Error uploading banner", error);
      swal("Failed", "Failed to upload banner.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/admin/deleteBannerImage/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      if (response.status === 200) {
        swal("Success", response.data.message);
        setAllBanners((prevBanners) =>
          prevBanners.filter((banner) => banner._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting banner", error);
      swal("Failed", "Failed to delete banner.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-80">
        <h2 className="text-2xl font-bold mb-6 mt-4">Upload Banner Image</h2>
        <form onSubmit={handleUpload} className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block mb-4"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload Banner
          </button>
        </form>        

        <h3 className="text-xl font-semibold mt-8">All Banners:</h3>
        <div className="flex flex-col gap-4 mt-4">
          {allBanners.map((banner) => (
            <div key={banner._id} className="flex items-center">
              <img
                src={`${banner.bannerUrl}`}
                alt="Banner"
                className="w-20 h-20 object-cover rounded-md shadow-md"
              />
              <button
                onClick={() => handleDelete(banner._id)}
                className="ml-12 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transform -translate-x-1 -translate-y-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BannerImage;
