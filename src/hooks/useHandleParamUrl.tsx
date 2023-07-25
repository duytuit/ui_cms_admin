import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useHandleParamUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const project = localStorage.getItem("project");
  useEffect(() => {
    if (project) {
        const _project = JSON.parse(project);
        setSearchParams({
            projectId: _project.projectId
          });
    }
  }, []);
 
  const handleParamUrl = (param: any) => {
    if (project) {
      const _project = JSON.parse(project);
      setSearchParams({
        projectId: _project.projectId,...param,
      });
    }
  };

  return { handleParamUrl };
};
