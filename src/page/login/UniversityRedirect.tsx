import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UniversityRedirect = () => {
  const navigate = useNavigate();
  const { universityId } = useParams<{ universityId: string }>();

  useEffect(() => {
    if (universityId) {
      // Redirect to login with query param (or state)
      navigate(`/?universityId=${universityId}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [universityId, navigate]);

  return null; // no UI needed
};

export default UniversityRedirect;