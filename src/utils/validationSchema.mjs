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
  zipCode: yup.string().required("Postal / Zip Code is required"),
  address: yup.string().required("Full address is required"),
  phone: yup
    .string()
    .required("Phone Number is required")
    .min(9, "Phone number must be at least 9 characters")
    .max(13, "Phone number cannot exceed 13 characters"), // gender: yup.string().required('Gender is required')
});

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const purchaseWithPaypal = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Please enter a valid email address")
    .required("Email is required"),
  amount: yup
    .number()
    .typeError("Please enter an amount") // Displayed if the value is not a number
    .min(10000, "Must be greater than or equal to 10000"), // Set your minimum value and a corresponding error messag
});
export const fastWithdraw = yup.object().shape({
  amount: yup
    .number()
    .typeError("Please enter an amount") // Displayed if the value is not a number
    .min(5000, "Must be greater than or equal to 5000") // Set your minimum value and a corresponding error messag
    .max(99999, "Must be less than or equal to 99999"), // Set your maximum value and a corresponding error message
});

export const purchaseWithCashApp = yup.object().shape({
  cashAppid: yup.string().required("cashAppid is required"),
  amount: yup
    .number()
    .typeError("Please enter an amount") // Displayed if the value is not a number
    .min(10000, "Must be greater than or equal to 10000"), // Set your minimum value and a corresponding error messag
});
