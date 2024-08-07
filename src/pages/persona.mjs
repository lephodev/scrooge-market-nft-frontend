/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import Persona from "persona";
import AuthContext from "../context/authContext.ts";

const PersonaComponent = ({ phoneNum, errors }) => {
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

  const handleOpenPersona = () => {
    if (Object.keys(errors).length === 0 && phoneNum?.length > 9) {
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
      personaClient.open();
    }
  };

  return (
    <div className="persona-btn" onClick={handleOpenPersona}>
      Verify
    </div>
  );
};

export default PersonaComponent;
