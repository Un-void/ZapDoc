import { createBrowserRouter } from "react-router";
import App from "./App";
import LandingPage from "./Components/LandingPage";
import SignUp from "./Components/SignUp";
import LogIn from "./Components/Login";
import ContactUs from "./Components/ContactUs";
import DoctorLogin from "./Components/DoctorLogin";
import DoctorRegistration from "./Components/DoctorRegistration";

const routes = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "",
                Component: LandingPage
            },
            {
                path: "/signup",
                Component: SignUp
            },
            {
                path: "/login",
                Component: LogIn
            },
            {
                path: "/contact",
                Component: ContactUs
            },
            {
                path: "/docreg",
                Component: DoctorRegistration
            },
            {
                path: "/doclog",
                Component: DoctorLogin
            }
        ]
    }   
]);

export default routes