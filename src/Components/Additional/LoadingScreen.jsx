import { Spinner } from "react-bootstrap";
import logo from "../Images/logo2.png";

const LoadingScreen = ({ loading }) => {
  return (
    loading && (
      <div className="spinner-container">
        <div className="content">
          <img src={logo} alt="Logo" className="logo" />
          <Spinner animation="border" variant="primary" className="spinner" />
        </div>
      </div>
    )
  );
};

export default LoadingScreen;