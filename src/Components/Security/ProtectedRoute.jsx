import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";
import { fetchRole } from "../Auth/CheckAuth";
import { useLoading } from "../Additional/LoadingScreen";
import LoadingAnim from "../Additional/LoadingAnim";
import { rolePathMap } from "./RolePathMap";
import { extractInnerPath } from "./NormalizePath";

const ProtectedRoute = ({ allowedRoles }) => {
  const [role, setRole] = React.useState(undefined);
  const [error, setError] = React.useState(false);
  const { setLoading } = useLoading();
  const location = useLocation();

  React.useEffect(() => {
    const loadRole = async () => {
      try {
        setLoading(true);
        const userRole = await fetchRole();
        if (!userRole) {
          setRole(null);
        } else {
          setRole(userRole);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, [setLoading]);

  // ⏳ Tekshiruv
  if (role === undefined && !error) {
    return <LoadingAnim />;
  }

  // ❌ Login qilmagan
  if (role === null) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  // ❌ Token yoki boshqa xato
  if (error) {
    return <Navigate to="/not-allowed" replace />;
  }

  // ⚠️ Role mos emas → o‘z roliga mos URL
  if (!allowedRoles.includes(role)) {
    const rolePrefix = rolePathMap[role];

    if (!rolePrefix) {
      return <Navigate to="/not-allowed" replace />;
    }

    const innerPath = extractInnerPath(location.pathname);

    return (
      <Navigate
        to={`/${rolePrefix}/${innerPath}`}
        replace
      />
    );
  }

  // ✅ Hammasi joyida
  return <Outlet />;
};

export default ProtectedRoute;
