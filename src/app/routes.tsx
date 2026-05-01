import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { CertificateTypeSelection } from "./components/CertificateTypeSelection";
import { UserDataForm } from "./components/UserDataForm";
import { CertificatePreview } from "./components/CertificatePreview";
import { Success } from "./components/Success";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { EventManagement } from "./components/EventManagement";
import { TemplateManager } from "./components/TemplateManager";
import { RecordManagement } from "./components/RecordManagement";
import { EmailAutomation } from "./components/EmailAutomation";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "select-certificate", Component: CertificateTypeSelection },
      { path: "form/:type", Component: UserDataForm },
      { path: "preview", Component: CertificatePreview },
      { path: "success", Component: Success },
      { path: "admin-login", Component: AdminLogin },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/events", Component: EventManagement },
      { path: "admin/templates", Component: TemplateManager },
      { path: "admin/records", Component: RecordManagement },
      { path: "admin/emails", Component: EmailAutomation },
    ],
  },
]);
