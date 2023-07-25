import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SubwayStation from "./pages/SubwayStation";
import Report from "./pages/Report";
import ManageProfile from "./pages/ManageProfile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/AccountSettings" element={<ManageProfile />} />
          <Route
            path="/SubwayStation/:NameOfStation"
            element={<SubwayStation />}
          />
          <Route path="/Report" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
