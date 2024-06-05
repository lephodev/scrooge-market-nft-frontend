/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import Persona from "persona";
import { Button } from "react-bootstrap";
import AuthContext from "../context/authContext.ts";

const PersonaComponent = ({ errors, number, phoneNum }) => {
  console.log("numbernumbernumber", number);
  const [client, setClient] = useState(null);
  const { user } = useContext(AuthContext);
  console.log("user", user);
  const {
    firstName,
    lastName,
    birthDate,
    address,
    city,
    zipCode,
    email,
    _id,
    id,
  } = user;

  useEffect(() => {
    console.log("numbernumbernumbernumber", number);
    // Initialize the Persona client and store it in state
    const personaClient = new Persona.Client({
      templateId: "itmpl_CZuaAe3eTnfzoQ4qp1Z2yHMJAqeH", // Your template ID
      environmentId: "env_qRUUMWexbxJxkuPhq7eRsEZvMgVw",
      referenceId: _id || id,
      fields: {
        nameFirst: firstName,
        nameLast: lastName,
        birthdate: birthDate,
        addressStreet1: address,
        addressCity: city,
        addressPostalCode: zipCode,
        addressCountryCode: "US",
        phoneNumber: phoneNum,
        emailAddress: email,
        // customAttribute: "hello",
      },
      onReady: () => {
        console.log("Persona client is ready");
      },
      onComplete: ({ inquiryId, status, fields }) => {
        console.log("onComplete", inquiryId, status, fields);
        window.location.href = "/kyc";
      },
      onCancel: ({ inquiryId, sessionToken }) => {
        console.log("onCancel", inquiryId, sessionToken);
      },
      onError: (error) => {
        console.error("onError", error);
      },
    });
    setClient(personaClient);
  }, [phoneNum]);
  const handleOpenPersona = () => {
    if (Object.keys(errors).length === 0 && phoneNum.length > 9) {
      if (client) {
        client.open();
      } else {
        console.error("Persona client is not initialized");
      }
    }
  };

  return (
    <div className="login-button full-w">
      <Button onClick={handleOpenPersona} className="l-btn ">
        Verify
      </Button>
    </div>
  );
};

export default PersonaComponent;
