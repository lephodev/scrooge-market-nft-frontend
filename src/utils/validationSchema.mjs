import * as yup from "yup";

export const createKYCSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      "First Name should be alphabetical"
    ),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      "Last Name should be alphabetical"
    ),
  //address: yup.string().required("Address is required"),
  //streetAdress: yup.string().required("Street Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  birthDate: yup
    .string()
    .required("Birthdate is required")
    .test("birthdate check", `You must be over 18`, function (value) {
      const now = new Date();
      const birthDate = new Date(value);
      const diff = now.getFullYear() - birthDate.getFullYear();
      if (diff > 18) {
        return true;
      }
      return false;
    }),
  // gender: yup.string().required('Gender is required')
});

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const purchaseWithPaypal = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Please enter a valid email address")
    .required("Email is required"),
});

export const purchaseWithCashApp = yup.object().shape({
  cashAppid: yup.string().required("cashAppid is required"),
});
