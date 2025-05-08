import { createBrowserRouter } from "react-router";
import App from "./App";
import LandingPage from "./Components/LandingPage";
import SignUp from "./Components/SignUp";
import LogIn from "./Components/LogIn";
import ContactUs from "./Components/ContactUs";

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
            }
        ]
    }   
]);

export default routes