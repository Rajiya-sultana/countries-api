
import { useTheme } from "../hooks/useTheme";

const Header = ({ theme }) => {
  const [isDark, setIsDark] = useTheme();



  return (
    <header className={`header ${isDark ? "dark" : ""}`}>
      <div className="header-content">
        <h2 className="title">Where in the world?</h2>
        <p
          className="theme-changer"
          onClick={() => {
            setIsDark(!isDark);
            localStorage.setItem("isDarkMode", !isDark);
          }}
        >
          <i className={`fa-solid fa-${isDark ? "sun" : "moon"}`}></i> &nbsp;
          {isDark ? "Light" : "Dark"} Mode
        </p>
      </div>
    </header>
  );
};
export default Header;
