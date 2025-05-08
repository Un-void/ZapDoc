import { createBrowserRouter } from "react-router";
import App from "./App";
import LandingPage from "./Components/LandingPage";

const routes = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "",
                Component: LandingPage
            },
            // {
            //     path: "/home",
            //     Component: Body
            // }
        ]
    }   
]);

export default routes