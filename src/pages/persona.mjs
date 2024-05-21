import { useState, useEffect } from "react";
import Persona from "persona";
import { Button } from "react-bootstrap";

const PersonaComponent = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Initialize the Persona client and store it in state
    const personaClient = new Persona.Client({
      templateId: "itmpl_HqjFkqSmMSmE3cCDzb28wcd4Bheq", // Your template ID
      environmentId: "env_QCjXWTLVKgSABin4Y1wP22TwYkVH",
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
    <div>
      <Button onClick={handleOpenPersona} className="l-btn ">
        Verify with Persona
      </Button>
    </div>
  );
};

export default PersonaComponent;
