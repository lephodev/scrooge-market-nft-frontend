/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import Persona from "persona";
import { Button } from "react-bootstrap";
import AuthContext from "../context/authContext.ts";

const PersonaComponent = () => {
  const [client, setClient] = useState(null);
  const { user } = useContext(AuthContext);
  console.log("user", user);
  const {
    firstName,
    lastName,
    birthDate,
    address,
    city,
    phone,
    zipCode,
    email,
  } = user;

  useEffect(() => {
    // Initialize the Persona client and store it in state
    const personaClient = new Persona.Client({
      templateId: "itmpl_CZuaAe3eTnfzoQ4qp1Z2yHMJAqeH", // Your template ID
      environmentId: "env_QCjXWTLVKgSABin4Y1wP22TwYkVH",
      referenceId: "23hgh",
      fields: {
        nameFirst: firstName,
        nameLast: lastName,
        birthdate: birthDate,
        addressStreet1: address,
        addressCity: city,
        addressPostalCode: zipCode,
        addressCountryCode: "US",
        phoneNumber: phone,
        emailAddress: email,
        // customAttribute: "hello",
      },
      onReady: () => {
        console.log("Persona client is ready");
      },
      onComplete: ({ inquiryId, status, fields }) => {
        console.log("onComplete", inquiryId, status, fields);
      },
      onCancel: ({ inquiryId, sessionToken }) => {
        console.log("onCancel", inquiryId, sessionToken);
      },
      onError: (error) => {
        console.error("onError", error);
      },
    });
    setClient(personaClient);
  }, []);

  const handleOpenPersona = () => {
    if (client) {
      client.open();
    } else {
      console.error("Persona client is not initialized");
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
