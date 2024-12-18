import { useEffect } from "react";
import { Link, useBlocker, useNavigate } from "react-router-dom";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/useAppContext";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    const authTokenFromSession = sessionStorage.getItem("authToken");
    const nameFromSession = sessionStorage.getItem("name");
    if (authTokenFromSession) {
      if (isLoggedIn && nameFromSession) {
        setUserName(nameFromSession);
      } else {
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUserName]);

  // const handleLogout=()=>{
  //     sessionStorage.removeItem('auth-token');
  //     sessionStorage.removeItem('name');
  //     sessionStorage.removeItem('email');
  //     setIsLoggedIn(false);
  //     navigate(`/app`);

  // };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${urlConfig.backendUrl}/api/auth/logout`, {
        method: "DELETE",
        credentials: "include", // Include cookies
      });

      if (res.ok) {
        alert("Logged out successfully");
        // Clear any user state if needed

        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        setIsLoggedIn(false);
        navigate("/app");
      } else {
        const error = await res.json();
        alert(`Logout failed: ${error.message}`);
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const profileSecton = () => {
    navigate(`/app/profile`);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        id="navbar_container"
      >
        <a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>
          GiftLink
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/home.html">
                Home
              </a>{" "}
              {/* Link to home.html */}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/app">
                Gifts
              </Link>{" "}
              {/* Updated Link */}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/app/search">
                Search
              </Link>
            </li>
            <ul className="navbar-nav ml-auto">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    {" "}
                    <span
                      className="nav-link"
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={profileSecton}
                    >
                      Welcome, {userName}
                    </span>{" "}
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link login-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link login-btn" to="/app/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link register-btn" to="/app/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </ul>
        </div>
      </nav>
    </>
  );
}
