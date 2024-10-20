import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./routes/routes";
import Header from "./component/main/Header";
import Footer from "./component/main/Footer";
import { Provider, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import store from "./store/store";
import { setUserInfo } from "./store/slice/userSlice";

import "./css/home.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppComponent />
      </BrowserRouter>
    </Provider>
  );
}

const AppComponent = () => {
  const dispatch = useDispatch();

  const userStorageData = JSON.parse(localStorage.getItem("pl_user_info"));
  if (userStorageData) {
    dispatch(setUserInfo(jwtDecode(userStorageData.accessToken)));
  }

  return (
    <div className="App">
      <Header />
      <Layout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
      <Footer />
    </div>
  );
};

const Layout = ({ children }) => {
  return <div id="body">{children}</div>;
};

export default App;
