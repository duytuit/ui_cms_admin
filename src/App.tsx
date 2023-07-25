import "./App.css";
import Main from "./modules/Main";
import { Toast } from 'primereact/toast';
import { ScrollTop } from "primereact/scrolltop";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "redux/features/toast";
function App() {
  const toast = useRef<any>();
  const dispatch = useDispatch();
  const toastOptions = useSelector((state:any) => state.toast)

  useEffect(() => {
    if (toastOptions.severity) {
      const show = () => {
        toast.current.show({ ...toastOptions });
      };
      show();
      dispatch(hideToast());
    }
  }, [toastOptions])
  return (
    <>
      <ScrollTop />
      <ConfirmDialog />
      <Main />
      <Toast ref={toast} />
    </>
  );
}

export default App;
