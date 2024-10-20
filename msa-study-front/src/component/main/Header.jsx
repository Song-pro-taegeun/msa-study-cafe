import { useState } from "react";
import { Link } from "react-router-dom";
import { menuList } from "../../util/dataJson";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../store/slice/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const [hoverMenu, setHoverMenu] = useState();
  const userInfo = useSelector((state) => state.userSlice);

  return (
    <>
      <div className="header">
        <div className="wrap">
          <Link to="/">
            <div className="logo">MSA Study Cafe</div>
          </Link>

          <ul className="menu">
            {menuList.map((data, i) => (
              <li key={i}>
                <span
                  onMouseOver={() => {
                    setHoverMenu(data);
                  }}
                >
                  {data.title}
                </span>

                <div>
                  {hoverMenu === data && (
                    <ul>
                      {hoverMenu?.child.map((subData, subIndex) => (
                        <li key={subIndex}>
                          <Link to={subData?.to}>
                            <span
                              onClick={() => {
                                setHoverMenu(null);
                              }}
                            >
                              {subData.subTitle}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {hoverMenu && (
            <div
              className="menu_bg"
              onMouseOut={() => {
                setHoverMenu(null);
              }}
            />
          )}

          <div className="login">
            <span className="material-symbols-outlined">account_circle</span>
            {!userInfo?.pmUserId && (
              <ul>
                <Link to="/signIn">
                  <li>로그인</li>
                </Link>
              </ul>
            )}

            {userInfo?.pmUserId && (
              <ul>
                <li
                  onClick={() => {
                    localStorage.removeItem("pl_user_info");
                    dispatch(setUserInfo(null));
                    setUserInfo(null);
                    window.location.href = "/";
                  }}
                >
                  로그아웃
                </li>
                <Link to="/signIn">
                  <li>마이페이지</li>
                </Link>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
