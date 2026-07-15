import { APP_CONFIG } from "@/lib/constants";
import "./admin.css";
import AdminClientLayout from "@/components/admin/AdminClientLayout";

export const metadata = {
  title: `${APP_CONFIG.siteName} - لوحة التحكم`,
  description: `لوحة التحكم الخاصة بمتجر ${APP_CONFIG.siteName}`,
};

export default function AdminLayout({ children }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
