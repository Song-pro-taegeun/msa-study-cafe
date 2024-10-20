import Home from "../component/main/Home";
import SignIn from "../component/sign/SignIn";
import SignUp from "../component/sign/SignUp";
import TestComponent from "../component/testComponent/TestComponent";
import PwdReset from "../component/sign/PwdReset";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/testComponent",
    element: <TestComponent />,
  },
  {
    path: "/passwordReset",
    element: <PwdReset />,
  },
];

export default routes;
