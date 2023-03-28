import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Spinner } from "react-bootstrap";
import LoadingPoker from "../images/scroogeHatLogo.png";
import cross from "../images/close-icon.svg";
import { createKYC, userKycDetails } from "../utils/api.mjs";
import { createKYCSchema } from "../utils/validationSchema.mjs";
import { toast } from 'react-toastify';
import Layout from "./Layout.mjs";
import { Link, useNavigate } from "react-router-dom";
import "../styles/kyc.css";

const KYCForm = () => {

  const navigate = useNavigate();
  const [frontIdImage, setfrontIdImage] = useState([]);
  const [backIdImage, setbackIdImage] = useState([]);
  const [statusKyc, setstatusKyc] = useState("NotApplied");
  const [loading, setLoading] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);
  // const [successMsg, setSuccessMsg] = useState("");
  const [activeRatioType, setActiveRatioType] = useState("Male");


  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    //reset,
  } = useForm({ resolver: yupResolver(createKYCSchema) });

  const handleImageChange = (e) => {
    const { name } = e.target;
    if (name === "IDimageFront") {
      setfrontIdImage([...e.target.files]);
    }
    if (name === "IDimageBack") {
      setbackIdImage([...e.target.files]);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setActiveRatioType(value);
  };

  const saveData = async (value) => {
    console.log("this is the value",value);
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
    
    payload.gender = activeRatioType;
    formData.append("IDimageFront", frontIdImage[0]);
    formData.append("IDimageBack", backIdImage[0]);
    formData.append("formValues", JSON.stringify(payload));
    setLoading(true);
    const response = await createKYC(formData);
    setLoading(false);
    if (response.code === 201) {
      setstatusKyc("idle");
      toast.success(response.message,{ toastId:"successfylly-submitted-kyc"})
    } else {
      toast.error(response.message);
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

 
  const getKYCStatus = async () => {
    const response = await userKycDetails();
    if (response?.code === 200) {
      setstatusKyc(response.message);
      setglobalLoader(false);
    }else{
      setglobalLoader(false);
      toast.error(response.message,{toastId:"error-fetching-kyc-details"})
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

  

  return (
    <Layout>
      {globalLoader && <div className='loading'>
          <div className='loading-img-div'>
            <img src={LoadingPoker} alt='game' className='imageAnimation' />
          </div>
        </div>}
        <div className="kyc-page">
        <div className="auth-page">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                
                  {statusKyc === "NotApplied" && (
                    <div className="login-form">
                      <h1>Know Your Customer</h1>
                      <p className="auth-para">
                        Please fill your details to verify KYC
                      </p>
                      <div className="login-box">
                        <Form onSubmit={handleSubmit(saveData)}>
                          <Form.Group className="form-group">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              placeholder="Enter your first name"
                              autoComplete="off"
                              className={errors.firstName ? "error-field" : ""}
                              {...register("firstName")}
                            />
                            {errors?.firstName ? (
                              <p className="error-text">
                                {errors?.firstName?.message}
                              </p>
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
                              className={errors.lastName ? "error-field" : ""}
                              {...register("lastName")}
                            />
                            {errors?.lastName ? (
                              <p className="error-text">
                                {errors?.lastName?.message}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <div className="select-banner-area form-group">
                            <Form.Label>Gender</Form.Label>
                            <div className="select-banner-option">
                              <Form.Group
                                className={`form-group ${activeRatioType === "Male" ? "active" : ""
                                  } deposit-cash-app`}
                                htmlFor="Male"
                              >
                                <Form.Check
                                  label="Male"
                                  name="bannerRatio"
                                  type="radio"
                                  id="Male"
                                  value="Male"
                                  defaultChecked={
                                    activeRatioType === "Male" ? true : false
                                  }
                                  onChange={handleOnChange}
                                />
                              </Form.Group>
                              <Form.Group
                                className={`form-group ${activeRatioType === "Female" ? "active" : ""
                                  } deposit-cash-app`}
                                htmlFor="Female"
                              >
                                <Form.Check
                                  label="Female"
                                  name="bannerRatio"
                                  type="radio"
                                  id="Female"
                                  value="Female"
                                  defaultChecked={
                                    activeRatioType === "Female" ? true : false
                                  }
                                  onChange={handleOnChange}
                                />
                              </Form.Group>
                            </div>
                          </div>
                          <div className="select-banner-area form-group">
                            <Form.Label>Date of Birth</Form.Label>
                            <div className="select-banner-option">
                            <input type="date" className="form-control" {...register("birthDate")}/>
                              
                              {errors?.birthDate ? (
                                <p className="error-text">
                                  {errors?.birthDate?.message}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
               
                          <Form.Group className="form-group">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              placeholder="Enter your city"
                              autoComplete="off"
                              className={errors.city ? "error-field" : ""}
                              {...register("city")}
                            />
                            {errors?.city ? (
                              <p className="error-text">
                                {errors?.city?.message}
                              </p>
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
                              {...register("state")}
                            />
                            {errors?.state ? (
                              <p className="error-text">
                                {errors?.state?.message}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <Form.Group className="form-group full-w">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                              type="text"
                              name="country"
                              placeholder="Enter your country"
                              autoComplete="off"
                              className={errors.country ? "error-field" : ""}
                              {...register("country")}
                            />
                            {errors?.country ? (
                              <p className="error-text">
                                {errors?.country?.message}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <Form.Group className="form-group ">
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
                                            onClick={() =>
                                              handleRemoveImage(0, false, false)
                                            }
                                          />
                                          <img
                                            src={window.URL.createObjectURL(
                                              frontIdImage[0]
                                            )}
                                            alt="logo-img"
                                          />
                                        </div>
                                      )}
                                      <div></div>
                                    </>
                                  ) : (
                                    <p>
                                      Drag & Drop or <span> Upload </span> the
                                      Image.
                                    </p>
                                  )}
                                </div>
                              </Form.Label>
                            </div>
                            {errors?.IDimageFront ? (
                              <p className="error-text">
                                {errors?.IDimageFront?.message}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <Form.Group className="form-group ">
                            <Form.Label>Upload Selfie with ID</Form.Label>
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
                                            onClick={() =>
                                              handleRemoveImage(0, false, false)
                                            }
                                          />
                                          <img
                                            src={window.URL.createObjectURL(
                                              backIdImage[0]
                                            )}
                                            alt="logo-img"
                                          />
                                        </div>
                                      )}
                                      <div></div>
                                    </>
                                  ) : (
                                    <p>
                                      Drag & Drop or <span> Upload </span> the
                                      Image.
                                    </p>
                                  )}
                                </div>
                              </Form.Label>
                            </div>
                            {errors?.IDimageBack ? (
                              <p className="error-text">
                                {errors?.IDimageBack?.message}
                              </p>
                            ) : (
                              ""
                            )}

                          </Form.Group>

                          <div className="login-button full-w">
                            <Button type="submit" className="l-btn">
                              {!loading ? (
                                "Save"
                              ) : (
                                <Spinner animation="border" />
                              )}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}

                  {statusKyc === "idle" && (
                    <SubmitKYC handleLogOut={handleLogOut} />
                  )}
                  {statusKyc === "reject" && (
                    <FailedKYC handleLogOut={handleLogOut} />
                  )}
                  {statusKyc === "accept" && (
                    <SuccessKYC handleLogOut={handleLogOut} />
                  )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    


    </Layout>
  );
};
export default KYCForm;

const SubmitKYC = ({ handleLogOut }) => {
  return (
    <div className="kyc-msg-grid">
      <div className="kyc-form-msg">
        <p>Your KYC request has been submitted, this may take up to 5 mins</p>
        <span onClick={handleLogOut}>Logout</span>
      </div>
    </div>
  );
};

const FailedKYC = ({ handleLogOut }) => {
  return (
    <div className="kyc-msg-grid">
      <div className="kyc-form-msg">
        <h4>Failed!</h4>
        <p>
          You already have an account with us, please contact support to get
          more information.
        </p>
        <Link to="/">Contact Support</Link>
        <span onClick={handleLogOut}>Logout</span>
      </div>
    </div>
  );
};

const SuccessKYC = ({ handleLogOut }) => {
  return (
    <div className="kyc-msg-grid">
      <div className="kyc-form-msg">
        <h4>Congrast!</h4>
        <p>
          Your KYC has been processed successfully. Thank you for choosing us!
        </p>
        <Link to="/profile">Profile</Link>
        <span onClick={handleLogOut}>Logout</span>
      </div>
    </div>
  );
};
