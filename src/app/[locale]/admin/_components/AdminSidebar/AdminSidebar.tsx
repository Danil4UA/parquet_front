import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import NavMain from "./NavMain"
import NavHeader from "./NavHeader"
import NavFooter from "./NavFooter"
import { Separator } from "@/components/ui/separator";

export default function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-5">
        <NavHeader />
      </SidebarHeader>
      <Separator className="w-4/5 self-center" />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}