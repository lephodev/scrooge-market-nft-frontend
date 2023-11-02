import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Spinner } from "react-bootstrap";
import LoadingPoker from "../images/scroogeHatLogo.png";
import cross from "../images/close-icon.svg";
import { createKYC, userKycDetails, reApply } from "../utils/api.mjs";
import { createKYCSchema } from "../utils/validationSchema.mjs";
import { toast } from "react-toastify";
import Layout from "./Layout.mjs";
import { useNavigate } from "react-router-dom";
import failed from "../images/failed.png";
// import submit from "../images/submit.png";
import success from "../images/success.png";
import pending from "../images/pending.png";
import "../styles/kyc.css";

const KYCForm = () => {
  const navigate = useNavigate();
  const [frontIdImage, setfrontIdImage] = useState([]);
  const [backIdImage, setbackIdImage] = useState([]);
  const [statusKyc, setstatusKyc] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaveLoader, setIsSaveLoader] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);
  const [unSupportedImg, setUnsupportedImg] = useState(true);
  // const [successMsg, setSuccessMsg] = useState("");
  const [activeRatioType, setActiveRatioType] = useState("Male");

  const {
    handleSubmit,
    register,
    setError,
    setValue,
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
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setActiveRatioType(value);
  };

  const saveData = async (value) => {
    setIsSaveLoader(true);
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

    payload.gender = activeRatioType;
    formData.append("IDimageFront", frontIdImage[0]);
    formData.append("IDimageBack", backIdImage[0]);
    formData.append("formValues", JSON.stringify(payload));
    setLoading(true);
    const res = await createKYC(formData);
    setLoading(false);
    if (res.status === 201) {
      getKYCStatus();
    } else {
      toast.error("Unable to Upload the Kyc");
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

  return (
    <Layout>
      <div className='kyc-page'>
        <div className='auth-page'>
          <div className='container'>
            {globalLoader && (
              <div className='loading'>
                <div className='loading-img-div'>
                  <img
                    src={LoadingPoker}
                    alt='game'
                    className='imageAnimation'
                  />
                </div>
              </div>
            )}
            {!globalLoader && (
              <div className='kycForm marketPlace_kycForm'>
                {statusKyc === "NotApplied" && (
                  <div className='login-form'>
                    <h1>Know Your Customer</h1>
                    <p className='auth-para'>
                      Please fill your details to verify KYC
                    </p>
                    <div className='login-box'>
                      <Form onSubmit={handleSubmit(saveData)}>
                        <Form.Group className='form-group'>
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type='text'
                            name='firstName'
                            placeholder='Enter your first name'
                            autoComplete='off'
                            className={errors.firstName ? "error-field" : ""}
                            {...register("firstName")}
                          />
                          {errors?.firstName ? (
                            <p className='error-text'>
                              {errors?.firstName?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                        <Form.Group className='form-group'>
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type='text'
                            name='lastName'
                            placeholder='Enter your last name'
                            autoComplete='off'
                            className={errors.lastName ? "error-field" : ""}
                            {...register("lastName")}
                          />
                          {errors?.lastName ? (
                            <p className='error-text'>
                              {errors?.lastName?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                        <div className='select-banner-area form-group'>
                          <Form.Label>Gender</Form.Label>
                          <div className='select-banner-option'>
                            <Form.Group
                              className={`form-group ${
                                activeRatioType === "Male" ? "active" : ""
                              } deposit-cash-app`}
                              htmlFor='Male'>
                              <Form.Check
                                label='Male'
                                name='bannerRatio'
                                type='radio'
                                id='Male'
                                value='Male'
                                defaultChecked={
                                  activeRatioType === "Male" ? true : false
                                }
                                onChange={handleOnChange}
                              />
                            </Form.Group>
                            <Form.Group
                              className={`form-group ${
                                activeRatioType === "Female" ? "active" : ""
                              } deposit-cash-app`}
                              htmlFor='Female'>
                              <Form.Check
                                label='Female'
                                name='bannerRatio'
                                type='radio'
                                id='Female'
                                value='Female'
                                defaultChecked={
                                  activeRatioType === "Female" ? true : false
                                }
                                onChange={handleOnChange}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className='select-banner-area form-group'>
                          <Form.Label>Date of Birth</Form.Label>
                          <input
                            type='date'
                            className='form-control'
                            {...register("birthDate")}
                          />

                          {errors?.birthDate ? (
                            <p className='error-text'>
                              {errors?.birthDate?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <Form.Group className='form-group'>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type='text'
                            name='city'
                            placeholder='Enter your city'
                            autoComplete='off'
                            className={errors.city ? "error-field" : ""}
                            {...register("city")}
                          />
                          {errors?.city ? (
                            <p className='error-text'>
                              {errors?.city?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                        <Form.Group className='form-group'>
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type='text'
                            name='state'
                            placeholder='Enter your state'
                            autoComplete='off'
                            className={errors.state ? "error-field" : ""}
                            {...register("state")}
                          />
                          {errors?.state ? (
                            <p className='error-text'>
                              {errors?.state?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                        <Form.Group className='form-group full-w'>
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type='text'
                            name='country'
                            placeholder='Enter your country'
                            autoComplete='off'
                            className={errors.country ? "error-field" : ""}
                            {...register("country")}
                          />
                          {errors?.country ? (
                            <p className='error-text'>
                              {errors?.country?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                        <Form.Group className='form-group '>
                          <Form.Label>Upload Front Id</Form.Label>
                          <div className='upload-game-thumnail'>
                            <Form.Control
                              type='file'
                              id='IDimageFront'
                              name='IDimageFront'
                              accept='.png, .jpg, .jpeg'
                              onChange={handleImageChange}
                            />
                            <Form.Label htmlFor='IDimageFront'>
                              <div className='no-image-area'>
                                {frontIdImage.length > 0 ? (
                                  <>
                                    {" "}
                                    {frontIdImage.length > 0 && (
                                      <div className='upload-grid'>
                                        <img
                                          src={cross}
                                          alt='cross'
                                          className='crossImg'
                                          onClick={() =>
                                            handleRemoveImage(0, false, false)
                                          }
                                        />
                                        {unSupportedImg && (
                                          <img
                                            src={window.URL.createObjectURL(
                                              frontIdImage[0]
                                            )}
                                            alt='logo-img'
                                          />
                                        )}
                                      </div>
                                    )}
                                    <div></div>
                                  </>
                                ) : (
                                  <p>
                                    <span> Upload </span> the Image.
                                  </p>
                                )}
                              </div>
                            </Form.Label>
                          </div>
                          {errors?.IDimageFront ? (
                            <p className='error-text'>
                              {errors?.IDimageFront?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                        <Form.Group className='form-group '>
                          <Form.Label>Upload Selfie with ID</Form.Label>
                          <div className='upload-game-thumnail'>
                            <Form.Control
                              type='file'
                              id='IDimageBack'
                              name='IDimageBack'
                              accept='.png, .jpg, .jpeg'
                              onChange={handleImageChange}
                            />
                            <Form.Label htmlFor='IDimageBack'>
                              <div className='no-image-area'>
                                {backIdImage.length > 0 ? (
                                  <>
                                    {" "}
                                    {backIdImage.length > 0 && (
                                      <div className='upload-grid'>
                                        <img
                                          src={cross}
                                          alt='cross'
                                          className='crossImg'
                                          onClick={() =>
                                            handleRemoveImage(0, false, false)
                                          }
                                        />
                                        <img
                                          src={window.URL.createObjectURL(
                                            backIdImage[0]
                                          )}
                                          alt='logo-img'
                                        />
                                      </div>
                                    )}
                                    <div></div>
                                  </>
                                ) : (
                                  <p>
                                    <span> Upload </span> the Image.
                                  </p>
                                )}
                              </div>
                            </Form.Label>
                          </div>
                          {errors?.IDimageBack ? (
                            <p className='error-text'>
                              {errors?.IDimageBack?.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>

                        <div className='login-button full-w'>
                          <Button
                            type='submit'
                            className='l-btn '
                            disabled={isSaveLoader}>
                            {!loading ? "Save" : <Spinner animation='border' />}
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
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default KYCForm;

const SubmitKYC = ({ handleLogOut }) => {
  return (
    <div className='kyc-msg-grid failedErrorBox'>
      <div className='kyc-form-msg'>
        <h4>Pending Verification </h4>
        <img src={pending} alt='failed' />
        <p>Your Documents have been submitted</p>
        {/* <span onClick={handleLogOut}>Logout</span> */}
      </div>
    </div>
  );
};

const FailedKYC = ({ handleLogOut, reapply, rejectionMessage }) => {
  return (
    <div className='kyc-msg-grid failedErrorBox'>
      <div className='kyc-form-msg'>
        <h4>Failed !</h4>
        <img src={failed} alt='failed' />
        <p>KYC submission rejected. Please contact support for assistance.</p>
        <p className='reject-reason'>
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
    <div className='kyc-msg-grid failedErrorBox'>
      <div className='kyc-form-msg'>
        <h4>Congrats !</h4>
        <img src={success} alt='failed' />
        <p>
          Your KYC has been processed successfully. Thank you for choosing us!
        </p>
        {/* <Link to="/profile">Profile</Link>
        <span onClick={handleLogOut}>Logout</span> */}
      </div>
    </div>
  );
};
