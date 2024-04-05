/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Spinner } from "react-bootstrap";
import LoadingPoker from "../images/scroogeHatLogo.png";
import cross from "../images/close-icon.svg";
import {
  createKYC,
  userKycDetails,
  reApply,
  VerifySessions,
} from "../utils/api.mjs";
import { createKYCSchema } from "../utils/validationSchema.mjs";
import { toast } from "react-toastify";
import Layout from "./Layout.mjs";
import { useNavigate } from "react-router-dom";
import failed from "../images/failed.png";
// import submit from "../images/submit.png";
import success from "../images/success.png";
import pending from "../images/pending.webp";
import "../styles/kyc.css";
import axios from "axios";

const KYCForm = () => {
  const navigate = useNavigate();
  const [frontIdImage, setfrontIdImage] = useState([]);
  const [backIdImage, setbackIdImage] = useState([]);
  const [optionalIdImage, setOptionalIdImage] = useState([]);
  const [statusKyc, setstatusKyc] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaveLoader /* setIsSaveLoader */] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);
  const [unSupportedImg, setUnsupportedImg] = useState(true);
  // const [successMsg, setSuccessMsg] = useState("");
  const [currentState, setCurrentState] = useState("");

  const [activeRatioType, setActiveRatioType] = useState("Male");

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
  } = useForm({ resolver: yupResolver(createKYCSchema) });

  const handleImageChange = (e) => {
    const { name } = e.target;
    console.log("name", name);
    const acceptedImageTypes = ["image/jpeg", "image/png"]; // Add more types if needed

    if (name === "IDimageFront") {
      const files = e.target.files;
      setUnsupportedImg(true);
      // Check if any files are selected
      if (files.length === 0) {
        clearErrors("IDimageFront");
        return;
      }

      // Check if all selected files are image files
      const allAreImages = Array.from(files).every((file) =>
        acceptedImageTypes.includes(file.type)
      );
      console.log("allAreImages", files);

      if (allAreImages) {
        setUnsupportedImg(true);
        setfrontIdImage([...files]);
        clearErrors("IDimageFront");
      } else {
        setUnsupportedImg(false);
        setError("IDimageFront", {
          message:
            "Unsupported File Format. Please upload images in JPEG or PNG format",
        }); // Handle the case where one or more selected files are not images
        // You can display an error message or perform other actions here
      }
    }

    if (name === "IDimageBack") {
      setUnsupportedImg(true);

      const files = e.target.files;

      // Check if any files are selected
      if (files.length === 0) {
        clearErrors("IDimageBack");
        return;
      }

      // Check if all selected files are image files
      const allAreImages = Array.from(files).every((file) =>
        acceptedImageTypes.includes(file.type)
      );
      setUnsupportedImg(true);

      console.log("allAreImages", allAreImages);
      if (allAreImages) {
        setbackIdImage([...files]);
        clearErrors("IDimageBack");
      } else {
        setError("IDimageBack", {
          message:
            "Unsupported File Format. Please upload images in JPEG or PNG format",
        });
        // Handle the case where one or more selected files are not images
        // You can display an error message or perform other actions here
      }
    }

    if (name === "IDimageOptional") {
      setUnsupportedImg(true);

      const files = e.target.files;

      // Check if any files are selected
      if (files.length === 0) {
        clearErrors("IDimageOptional");
        return;
      }

      // Check if all selected files are image files
      const allAreImages = Array.from(files).every((file) =>
        acceptedImageTypes.includes(file.type)
      );
      setUnsupportedImg(true);

      console.log("allAreImages", allAreImages);
      if (allAreImages) {
        setOptionalIdImage([...files]);
        clearErrors("IDimageOptional");
      } else {
        setError("IDimageOptional", {
          message:
            "Unsupported File Format. Please upload images in JPEG or PNG format",
        });
        // Handle the case where one or more selected files are not images
        // You can display an error message or perform other actions here
      }
    }
  };

  // const handleOnChange = (e) => {
  //   const { value } = e.target;
  //   setActiveRatioType(value);
  // };

  // const saveData = async (value) => {
  //   // setIsSaveLoader(true);
  //   const formData = new FormData();
  //   let payload = { ...value };

  //   if (frontIdImage.length !== 1) {
  //     setError("IDimageFront", {
  //       message: "Please uplaod front image of ID",
  //     });
  //     return;
  //   }

  //   if (backIdImage.length !== 1) {
  //     setError("IDimageBack", {
  //       message: "Please upload your selfie with your Id",
  //     });
  //     return;
  //   }
  //   let mbLimit = 10 * 1024 * 1024;

  //   if (frontIdImage[0]?.size > mbLimit) {
  //     setError("IDimageFront", {
  //       message: "Front image of ID size should not be greater than 10 MB.",
  //     });
  //     return;
  //   }

  //   if (backIdImage[0]?.size > mbLimit) {
  //     setError("IDimageBack", {
  //       message:
  //         "Selfie with your Id image size should not be greater than 10 MB.",
  //     });
  //     return;
  //   }

  //   if (optionalIdImage[0]?.size > mbLimit) {
  //     setError("IDimageOptional", {
  //       message: "Optional image size should not be greater than 10 MB.",
  //     });
  //     return;
  //   }

  //   payload.gender = activeRatioType;
  //   formData.append("IDimageFront", frontIdImage[0]);
  //   formData.append("IDimageBack", backIdImage[0]);
  //   formData.append("IDimageOptional", optionalIdImage[0]);

  //   formData.append("formValues", JSON.stringify(payload));
  //   setLoading(true);
  //   const res = await createKYC(formData);
  //   setLoading(false);
  //   if (res.status === 201) {
  //     getKYCStatus();
  //   } else {
  //     toast.error("Unable to Upload the Kyc");
  //   }
  // };

  // const handleRemoveImage = (index, imgCheck, prevCheck) => {
  //   if (imgCheck) {
  //     if (!prevCheck) {
  //       const copyBannerImg = [...frontIdImage];
  //       copyBannerImg.splice(index, 1);
  //       setfrontIdImage(copyBannerImg);
  //     } else {
  //       // copyPreviewyBannerImg.splice(index, 1);
  //     }
  //   }
  // };

  const reapply = async () => {
    setglobalLoader(true);
    const response = await reApply();
    if (response?.code === 200) {
      setglobalLoader(false);
      setstatusKyc(response.message);
    } else {
      setglobalLoader(false);
      toast.error(response.message, { toastId: "error-fetching-kyc-details" });
    }
  };

  const getKYCStatus = async () => {
    const response = await userKycDetails();
    console.log("response", response);
    if (response?.code === 200) {
      setstatusKyc(response.message);
      setRejectionMessage(response?.description);
      setValue("firstName", response?.userDetails?.firstName);
      setValue("lastName", response?.userDetails?.lastName);
      setValue("birthDate", response?.userDetails?.birthDate);
      setValue("city", response?.userDetails?.city);
      setValue("state", response?.userDetails?.state);
      setValue("country", response?.userDetails?.country);
      setValue("address", response?.userDetails?.address);
      setValue("zipCode", response?.userDetails?.zipCode);
      setglobalLoader(false);
    } else {
      setglobalLoader(false);
      toast.error(response.message, { toastId: "error-fetching-kyc-details" });
    }
  };
  const handleLogOut = () => {
    localStorage.removeItem("river@token");
    localStorage.removeItem("river@userId");
    //setUser(null);
    //setTokens({});
    //setuserCredentials(null);
    toast.success("Logout Successfully");
    navigate("/login");
  };

  useEffect(() => {
    getKYCStatus();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://geolocation-db.com/json/");
        const CurrentIp = res?.data?.IPv4;
        const res1 = await axios.get(`https://ipapi.co/${CurrentIp}/region`);
        const CurrentCity = res1?.data;
        console.log("CurrentCity", CurrentCity);
        setCurrentState(CurrentCity);
      } catch (error) {
        console.log("errr", error);
      }
    })();
  }, []);

  const handleVerify = async () => {
    const res = await VerifySessions();
    console.log("res", res);
    if (res.status === "success") {
      let url = res?.verification?.url;
      window.location.href = `${url}`;
    }
  };

  return (
    <Layout>
      <div className="kyc-page">
        <div className="auth-page">
          <div className="container">
            {globalLoader && (
              <div className="loading">
                <div className="loading-img-div">
                  <img
                    src={LoadingPoker}
                    alt="game"
                    className="imageAnimation"
                  />
                </div>
              </div>
            )}

            {!globalLoader && (
              <>
                {currentState === "Michigan" ? (
                  <div
                    style={{
                      marginTop: "100px",
                      textAlign: "center",
                      color: "white",
                      backgroundColor: "red",
                    }}
                  >
                    Due to state legislations, our application is no longer
                    available in your current location
                  </div>
                ) : (
                  <div className="kycForm marketPlace_kycForm">
                    {statusKyc === "NotApplied" && (
                      <div className="login-form">
                        <h1>Know Your Customer</h1>

                        <Button onClick={() => handleVerify()}>Verify</Button>
                      </div>
                    )}

                    {statusKyc === "idle" && (
                      <SubmitKYC handleLogOut={handleLogOut} />
                    )}
                    {statusKyc === "reject" && (
                      <FailedKYC
                        handleLogOut={handleLogOut}
                        reapply={reapply}
                        rejectionMessage={rejectionMessage}
                      />
                    )}
                    {statusKyc === "accept" && (
                      <SuccessKYC handleLogOut={handleLogOut} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default KYCForm;

const SubmitKYC = ({ handleLogOut }) => {
  return (
    <div className="kyc-msg-grid updated-kyc">
      <div className="kyc-form-msg">
        <img src={pending} alt="pending" className="img-fluid" loading="lazy" />
      </div>
    </div>
  );
};

const FailedKYC = ({ handleLogOut, reapply, rejectionMessage }) => {
  return (
    <div className="kyc-msg-grid failedErrorBox">
      <div className="kyc-form-msg">
        <h4>Failed !</h4>
        <img src={failed} alt="failed" />
        <p>KYC submission rejected. Please contact support for assistance.</p>
        <p className="reject-reason">
          <span>Reason </span> : {rejectionMessage}
        </p>
        <button onClick={reapply}>Re-Apply</button>
        {/* <Link to="/">Contact Support</Link>
        <span onClick={handleLogOut}>Logout</span> */}
      </div>
    </div>
  );
};

const SuccessKYC = ({ handleLogOut }) => {
  return (
    <div className="kyc-msg-grid failedErrorBox">
      <div className="kyc-form-msg">
        <h4>Congrats !</h4>
        <img src={success} alt="failed" />
        <p>
          Your KYC has been processed successfully. Thank you for choosing us!
        </p>
        {/* <Link to="/profile">Profile</Link>
        <span onClick={handleLogOut}>Logout</span> */}
      </div>
    </div>
  );
};
