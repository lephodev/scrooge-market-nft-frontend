/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Spinner } from "react-bootstrap";
import LoadingPoker from "../images/scroogeHatLogo.png";
import cross from "../images/close-icon.svg";
import {
  userKycDetails,
  reApply,
  createKYC,
  UpdateKycImage,
} from "../utils/api.mjs"; //
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
import AuthContext from "../context/authContext.ts";
import { marketPlaceInstance } from "../config/axios.js";
import { Link } from "react-router-dom";

const KYCForm = () => {
  const navigate = useNavigate();
  const [frontIdImage, setfrontIdImage] = useState([]);
  const [backIdImage, setbackIdImage] = useState([]);
  const [optionalIdImage, setOptionalIdImage] = useState([]);
  const [statusKyc, setstatusKyc] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState(""); //rejectionMessage
  const [loading, setLoading] = useState(false);
  const [isSaveLoader /* setIsSaveLoader */] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);
  const [unSupportedImg, setUnsupportedImg] = useState(true);
  const [analyzeLoader, setAnalyzerLoader] = useState(false);
  const [analyzeData, setAnalyzeData] = useState({});
  const [kycData, setKycData] = useState({});
  // const [successMsg, setSuccessMsg] = useState("");
  const [currentState, setCurrentState] = useState("");
  const { user } = useContext(AuthContext);
  const [iframeUrl, setIframUrl] = useState();

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
    console.log("e", e.target);
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

  const handleOnChange = (e) => {
    const { value } = e.target;
    setActiveRatioType(value);
  };

  const saveData = async (value) => {
    try {
      // setIsSaveLoader(true);
      const formData = new FormData();
      let payload = { ...value };

      if (frontIdImage.length !== 1) {
        setError("IDimageFront", {
          message: "Please uplaod front image of ID",
        });
        return;
      }

      if (backIdImage.length !== 1) {
        setError("IDimageBack", {
          message: "Please upload your selfie with your Id",
        });
        return;
      }

      if (optionalIdImage.length !== 1) {
        setError("IDimageOptional", {
          message: "Please upload your Proof of Address Id",
        });
        return;
      }
      let mbLimit = 10 * 1024 * 1024;

      if (frontIdImage[0]?.size > mbLimit) {
        setError("IDimageFront", {
          message: "Front image of ID size should not be greater than 10 MB.",
        });
        return;
      }

      if (backIdImage[0]?.size > mbLimit) {
        setError("IDimageBack", {
          message:
            "Selfie with your Id image size should not be greater than 10 MB.",
        });
        return;
      }

      if (optionalIdImage[0]?.size > mbLimit) {
        setError("IDimageOptional", {
          message: "Optional image size should not be greater than 10 MB.",
        });
        return;
      }

      payload.gender = activeRatioType;
      formData.append("IDimageFront", frontIdImage[0]);
      formData.append("IDimageBack", backIdImage[0]);
      formData.append("IDimageOptional", optionalIdImage[0]);

      formData.append("formValues", JSON.stringify(payload));
      setLoading(true);
      const res = await createKYC(formData);
      setLoading(false);
      if (res.status === 201) {
        getKYCStatus();
      } else {
        toast.error("Unable to Upload the Kyc");
      }
    } catch (error) {
      toast.error("Upload Failed, please contact support for assistance.");
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleRemoveImage = (index, imgCheck, prevCheck) => {
    if (imgCheck) {
      if (!prevCheck) {
        const copyBannerImg = [...frontIdImage];
        copyBannerImg.splice(index, 1);
        setfrontIdImage(copyBannerImg);
      } else {
        // copyPreviewyBannerImg.splice(index, 1);
      }
    }
  };

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
      setValue("phone", response?.userDetails?.phone);
      setKycData(response);

      console.log(" response?.userDetails", response?.userDetails);

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

  console.log("user in kyc", user);
  const kycRedirection = () => {
    window.location.href = `https://flow-dev.togggle.io/scrooge/kyc?uid=${
      user?._id || user?.id
    }`;
  };

  useEffect(() => {
    getKYCStatus();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://ipapi.co/ip");
        const CurrentIp = res?.data;
        const res1 = await axios.get(`https://ipapi.co/${CurrentIp}/region`);
        const CurrentCity = res1?.data;
        console.log("CurrentCity", CurrentCity);
        setCurrentState(CurrentCity);
      } catch (error) {
        console.log("errr", error);
      }
    })();
  }, []);

  const handleVerify = async (value) => {
    let payload = { ...value };

    try {
      setAnalyzerLoader(true);
      const response = await (
        await marketPlaceInstance()
      ).post("/IdAnalyzerWithDocupass", payload);
      console.log("IdAnalyzerWithDocupass", response);
      if (response.status === 200) {
        setAnalyzeData(response?.data?.response);
        setAnalyzerLoader(false);
      }
      // return response.data;
    } catch (error) {
      setAnalyzerLoader(false);
      console.log("error in deposit>>", error);
      return error?.response?.data;
    }
  };

  const hadleUpdateProofImage = async () => {
    setAnalyzerLoader(true);

    try {
      let mbLimit = 10 * 1024 * 1024;
      const formData = new FormData();

      console.log("hadleUpdateProofImage", optionalIdImage[0]);
      if (optionalIdImage.length !== 1) {
        setError("IDimageOptional", {
          message: "Please upload your Proof of Address Id",
        });
        setAnalyzerLoader(false);

        return;
      }
      if (optionalIdImage[0]?.size > mbLimit) {
        setError("IDimageOptional", {
          message: "Optional image size should not be greater than 10 MB.",
        });
        setAnalyzerLoader(false);

        return;
      }
      formData.append("IDimageOptional", optionalIdImage[0]);

      const res = await UpdateKycImage(formData);
      const {
        status,
        data: { message },
      } = res;
      if (status === 200) {
        getKYCStatus();
        toast.success(message);
        setAnalyzerLoader(false);
      }
    } catch (err) {
      console.log("errorerror", err);
    }
  };

  // const handleIframe = (url) => {
  //   setIframUrl(url);
  // };

  return (
    <Layout>
      <div className="kyc-page">
        <div className="auth-page">
          {/* {iframeUrl ? (
            <iframe
              src={iframeUrl}
              width="100%"
              height="800px"
              allowFullScreen
              allow="otp-credentials midi 'src'; geolocation 'src'; microphone 'src'; camera 'src';
               display-capture 'src'; otp-credentials 'src'; encrypted-media 'src';"
            />
          ) : ( */}
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
                      <>
                        <OldForm
                          handleSubmit={handleSubmit}
                          saveData={saveData}
                          getValues={getValues}
                          errors={errors}
                          register={register}
                          activeRatioType={activeRatioType}
                          handleOnChange={handleOnChange}
                          handleImageChange={handleImageChange}
                          frontIdImage={frontIdImage}
                          handleRemoveImage={handleRemoveImage}
                          unSupportedImg={unSupportedImg}
                          backIdImage={backIdImage}
                          optionalIdImage={optionalIdImage}
                          isSaveLoader={isSaveLoader}
                          loading={loading}
                          handleVerify={handleVerify}
                          analyzeLoader={analyzeLoader}
                          analyzeData={analyzeData}
                        />
                      </>
                      // <Button onClick={kycRedirection}>Verify KYC</Button>
                    )}
                    {/* {statusKyc === "reject" && (
                      <FailedKYC
                        handleLogOut={handleLogOut}
                        reapply={reapply}
                        rejectionMessage={rejectionMessage}
                      />
                    )} */}
                    {statusKyc === "idle" && (
                      <SubmitKYC handleLogOut={handleLogOut} />
                    )}
                    {statusKyc === "review" && (
                      <ReviewKYC
                        handleLogOut={handleLogOut}
                        handleImageChange={handleImageChange}
                        optionalIdImage={optionalIdImage}
                        handleRemoveImage={handleRemoveImage}
                        errors={errors}
                        hadleUpdateProofImage={hadleUpdateProofImage}
                        analyzeLoader={analyzeLoader}
                        kycData={kycData}
                        rejectionMessage={rejectionMessage}
                      />
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
          {/* )} */}
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

const FailedKYC = ({ reapply, rejectionMessage }) => {
  const uniqueReasons = [...new Set(rejectionMessage)];

  return (
    <div className="kyc-msg-grid failedErrorBox">
      <div className="kyc-form-msg">
        <h4>Failed !</h4>
        <img src={failed} alt="failed" />
        <p>KYC submission rejected. Please contact support for assistance.</p>
        <p className="reject-reason">
          <span>Reason:</span>
        </p>
        <ul>
          {uniqueReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <button onClick={reapply}>Re-Apply</button>
        {/* <Link to="/">Contact Support</Link>
        <span onClick={handleLogOut}>Logout</span> */}
      </div>
    </div>
  );
};

const ReviewKYC = ({
  handleRemoveImage,
  handleImageChange,
  optionalIdImage,
  errors,
  hadleUpdateProofImage,
  analyzeLoader,
  kycData,
  rejectionMessage,
}) => {
  console.log("rejectionMessage", rejectionMessage);
  const uniqueReasons = [...new Set(rejectionMessage)];
  console.log("uniqueReasons", uniqueReasons);
  const { timeStamp } = kycData;
  return (
    <div className="kyc-msg-grid failedErrorBox">
      <div className="kyc-form-msg">
        <h4>Review !</h4>
        <img src={failed} alt="failed" />
        <p>
          KYC submission is In Review . Please contact support for assistance.
        </p>
        <>
          <p> Request submitted to admin</p>
          Reason{" "}
          <ul>
            {uniqueReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </>
        <Form /* onSubmit={handleSubmit(handleVerify)} */>
          <Form.Group className="form-group ">
            <Form.Label>
              Upload Proof of address. Acceptable items include: Utility bill
              (Gas, electric, cable, television, water) Property Tax Receipt
              Govt mail.
            </Form.Label>
            <div className="upload-game-thumnail">
              <Form.Control
                type="file"
                id="IDimageOptional"
                name="IDimageOptional"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageChange}
              />
              <Form.Label htmlFor="IDimageOptional">
                <div className="no-image-area">
                  {optionalIdImage.length > 0 ? (
                    <>
                      {" "}
                      {optionalIdImage.length > 0 && (
                        <div className="upload-grid">
                          <img
                            src={cross}
                            alt="cross"
                            className="crossImg"
                            onClick={() => handleRemoveImage(0, false, false)}
                          />
                          <img
                            src={window.URL.createObjectURL(
                              optionalIdImage[0]
                            )}
                            alt="logo-img"
                          />
                        </div>
                      )}
                      <div></div>
                    </>
                  ) : (
                    <div className="image-placeholder address-placeholder">
                      <p>
                        <span> Upload </span> the Image.
                      </p>
                    </div>
                  )}
                </div>
              </Form.Label>
            </div>
            {errors?.IDimageOptional ? (
              <p className="error-text" style={{ color: "red" }}>
                {errors?.IDimageOptional?.message}
              </p>
            ) : (
              ""
            )}
          </Form.Group>

          {/* <Button type="submit" className="l-btn " disabled={analyzeLoader}>
              {!analyzeLoader ? "Verify" : <Spinner animation="border" />}
            </Button> */}
          <Button
            disabled={analyzeLoader}
            style={{
              alignItems: "center",
              alignContent: "center",
              marginLeft: "11vh",
              width: "35vh",
            }}
            className="l-btn-formbutton"
            onClick={() => hadleUpdateProofImage()}
          >
            {!analyzeLoader ? "Update" : <Spinner animation="border" />}
          </Button>
        </Form>
        {/* {timeStamp?.IDimageOptional && timeStamp?.IDimageOptional !== "" ? (
          
        ) : (
          
        )} */}
        {/* <p className="reject-reason">
          <span>Reason </span> : {rejectionMessage}
        </p> */}
        {/* <button onClick={reapply}>Re-Apply</button> */}
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

const OldForm = ({
  handleSubmit,
  saveData,
  getValues,
  errors,
  register,
  activeRatioType,
  handleOnChange,
  handleImageChange,
  frontIdImage,
  handleRemoveImage,
  unSupportedImg,
  backIdImage,
  optionalIdImage,
  isSaveLoader,
  loading,
  handleVerify,
  analyzeLoader,
  analyzeData,
  handleIframe,
}) => {
  return (
    <>
      <div className="login-form">
        <h1>Know Your Customer</h1>

        <p>
          <span style={{ color: "red" }}>Note: </span> Please fill in your
          details for verification If your address on ID doesn’t match profile,
          please submit a utility, mobile or other document verifying address on
          profile
        </p>
        <p className="auth-para">Please fill your details to verify KYC</p>
        <div className="login-box">
          <Form onSubmit={handleSubmit(handleVerify)}>
            <Form.Group className="form-group">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                autoComplete="off"
                readOnly={getValues("firstName") ? true : false}
                className={errors.firstName ? "error-field" : ""}
                {...register("firstName")}
              />
              {errors?.firstName ? (
                <p className="error-text">{errors?.firstName?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                autoComplete="off"
                readOnly={getValues("lastName") ? true : false}
                className={errors.lastName ? "error-field" : ""}
                {...register("lastName")}
              />
              {errors?.lastName ? (
                <p className="error-text">{errors?.lastName?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>

            {/* <div className="select-banner-area form-group">
              <Form.Label>Gender</Form.Label>
              <div className="select-banner-option">
                <Form.Group
                  className={`form-group ${
                    activeRatioType === "Male" ? "active" : ""
                  } deposit-cash-app`}
                  htmlFor="Male"
                >
                  <Form.Check
                    label="Male"
                    name="bannerRatio"
                    type="radio"
                    id="Male"
                    value="Male"
                    defaultChecked={activeRatioType === "Male" ? true : false}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group
                  className={`form-group ${
                    activeRatioType === "Female" ? "active" : ""
                  } deposit-cash-app`}
                  htmlFor="Female"
                >
                  <Form.Check
                    label="Female"
                    name="bannerRatio"
                    type="radio"
                    id="Female"
                    value="Female"
                    defaultChecked={activeRatioType === "Female" ? true : false}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </div>
            </div> */}
            <div className="select-banner-area form-group">
              <Form.Label>Date of Birth</Form.Label>
              <input
                type="date"
                readOnly={getValues("birthDate") ? true : false}
                className="form-control"
                {...register("birthDate")}
              />

              {errors?.birthDate ? (
                <p className="error-text">{errors?.birthDate?.message}</p>
              ) : (
                ""
              )}
            </div>

            <Form.Group className="form-group">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Enter your city"
                autoComplete="off"
                className={errors.city ? "error-field" : ""}
                readOnly={getValues("city") ? true : false}
                {...register("city")}
              />
              {errors?.city ? (
                <p className="error-text">{errors?.city?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                placeholder="Enter your state"
                autoComplete="off"
                className={errors.state ? "error-field" : ""}
                readOnly={getValues("state") ? true : false}
                {...register("state")}
              />
              {errors?.state ? (
                <p className="error-text">{errors?.state?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                placeholder="Enter your country"
                autoComplete="off"
                className={errors.country ? "error-field" : ""}
                {...register("country")}
                readOnly={getValues("country") ? true : false}
              />
              {errors?.country ? (
                <p className="error-text">{errors?.country?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Postal / Zip code</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                placeholder="Enter your postal / zip code"
                autoComplete="off"
                className={errors.zipCode ? "error-field" : ""}
                readOnly={getValues("zipCode") ? true : false}
                {...register("zipCode")}
              />
              {errors?.zipCode ? (
                <p className="error-text">{errors?.zipCode?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Full Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter your full address"
                autoComplete="off"
                className={errors.address ? "error-field" : ""}
                readOnly={getValues("address") ? true : false}
                {...register("address")}
              />
              {errors?.address ? (
                <p className="error-text">{errors?.address?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                placeholder="Enter your phone number"
                autoComplete="off"
                className={errors.phone ? "error-field" : ""}
                readOnly={getValues("phone") ? true : false}
                {...register("phone")}
              />
              {errors?.phone ? (
                <p className="error-text">{errors?.phone?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>

            {/* <Form.Group className="form-group ">
              <Form.Label>Upload Front Id</Form.Label>
              <div className="upload-game-thumnail">
                <Form.Control
                  type="file"
                  id="IDimageFront"
                  name="IDimageFront"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageChange}
                />
                <Form.Label htmlFor="IDimageFront">
                  <div className="no-image-area">
                    {frontIdImage.length > 0 ? (
                      <>
                        {" "}
                        {frontIdImage.length > 0 && (
                          <div className="upload-grid">
                            <img
                              src={cross}
                              alt="cross"
                              className="crossImg"
                              onClick={() => handleRemoveImage(0, false, false)}
                            />
                            {unSupportedImg && (
                              <img
                                src={window.URL.createObjectURL(
                                  frontIdImage[0]
                                )}
                                alt="logo-img"
                              />
                            )}
                          </div>
                        )}
                        <div></div>
                      </>
                    ) : (
                      <div className="image-placeholder front-placeholder">
                        <p>
                          <span> Upload </span> the Image.
                        </p>
                      </div>
                    )}
                  </div>
                </Form.Label>
              </div>
              {errors?.IDimageFront ? (
                <p className="error-text">{errors?.IDimageFront?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="form-group ">
              <Form.Label>Upload Back Image</Form.Label>
              <div className="upload-game-thumnail">
                <Form.Control
                  type="file"
                  id="IDimageBack"
                  name="IDimageBack"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageChange}
                />
                <Form.Label htmlFor="IDimageBack">
                  <div className="no-image-area">
                    {backIdImage.length > 0 ? (
                      <>
                        {" "}
                        {backIdImage.length > 0 && (
                          <div className="upload-grid">
                            <img
                              src={cross}
                              alt="cross"
                              className="crossImg"
                              onClick={() => handleRemoveImage(0, false, false)}
                            />
                            <img
                              src={window.URL.createObjectURL(backIdImage[0])}
                              alt="logo-img"
                            />
                          </div>
                        )}
                        <div></div>
                      </>
                    ) : (
                      <div className="image-placeholder selfi-placeholder">
                        <p>
                          <span> Upload </span> the Image.
                        </p>
                      </div>
                    )}
                  </div>
                </Form.Label>
              </div>
              {errors?.IDimageBack ? (
                <p className="error-text">{errors?.IDimageBack?.message}</p>
              ) : (
                ""
              )}
            </Form.Group>

            <Form.Group className="form-group ">
              <Form.Label>Upload selfi.</Form.Label>
              <div className="upload-game-thumnail">
                <Form.Control
                  type="file"
                  id="IDimageOptional"
                  name="IDimageOptional"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageChange}
                />
                <Form.Label htmlFor="IDimageOptional">
                  <div className="no-image-area">
                    {optionalIdImage.length > 0 ? (
                      <>
                        {" "}
                        {optionalIdImage.length > 0 && (
                          <div className="upload-grid">
                            <img
                              src={cross}
                              alt="cross"
                              className="crossImg"
                              onClick={() => handleRemoveImage(0, false, false)}
                            />
                            <img
                              src={window.URL.createObjectURL(
                                optionalIdImage[0]
                              )}
                              alt="logo-img"
                            />
                          </div>
                        )}
                        <div></div>
                      </>
                    ) : (
                      <div className="image-placeholder address-placeholder">
                        <p>
                          <span> Upload </span> the Image.
                        </p>
                      </div>
                    )}
                  </div>
                </Form.Label>
              </div>
              {errors?.IDimageOptional ? (
                <p className="error-text">{errors?.IDimageOptional?.message}</p>
              ) : (
                ""
              )}
            </Form.Group> */}

            <div className="login-button full-w">
              <>
                {/* <Button
                  className="l-btn "
                  disabled={analyzeLoader}
                  onClick={() => handleVerify()}
                >
                  {!analyzeLoader ? "Verify" : <Spinner animation="border" />}
                </Button> */}
              </>
              <Button type="submit" className="l-btn " disabled={analyzeLoader}>
                {!analyzeLoader ? "Verify" : <Spinner animation="border" />}
              </Button>
              {console.log(
                "Object.keys(analyzeData).length",
                Object.keys(analyzeData).length
              )}

              {Object.keys(analyzeData).length > 0 && (
                <>
                  <p style={{ color: "red", marginTop: "10px" }}>
                    Click the link below and proceed through the indicated
                    steps. If using Pc, you need to scan the QR code and
                    complete with a mobile device.
                  </p>
                  <div className="login-button full-w">
                    <>
                      <span style={{ color: "yellow", marginTop: "10px" }}>
                        Reference:
                      </span>{" "}
                      {analyzeData?.reference}
                      <span
                        className="urlparentspan"
                        style={{ display: "flex" }}
                      >
                        {" "}
                        <span style={{ color: "yellow" }}>URL:</span>{" "}
                        <a
                          href={analyzeData?.url}
                          className="affiliateurllink"
                          style={{
                            cursor: "pointer",
                            color: "white",
                            textDecoration: "underline",
                            fontSize: "15px",
                            overflowWrap: "anywhere",
                            paddingLeft: "5px",
                          }}
                        >
                          {analyzeData?.url}
                        </a>
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: "16px",
                        }}
                      >
                        <img
                          style={{ height: "190px", width: "190px" }}
                          src={analyzeData?.qrCode}
                          alt="cross"
                          className="crossImg"
                        />
                      </div>
                    </>
                  </div>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
