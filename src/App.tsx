import "./App.css";
import Main from "./modules/Main";

import { ScrollTop } from "primereact/scrolltop";
import { ConfirmDialog } from "primereact/confirmdialog";
function App() {
  return (
    <>
      <ScrollTop />
      <ConfirmDialog />
      <Main />
    </>
  );
}

export default App;
