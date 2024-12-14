import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminIndex from "./pages/admin/Index";
import Callback from "./pages/Callback";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;