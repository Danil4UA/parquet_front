import React from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { isStartsWithRoute } from "@/Utils/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type INavLinkItem = {
  item: {
    name: string
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    route: string
    disabled?: boolean
  }
}

export default function NavLinkItem({ item }: INavLinkItem) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isStartsWithRoute(item, pathname)}
        asChild
        className={`hover:shadow-sm data-[active=true]:shadow-sm ${item.disabled ? "pointer-events-none opacity-50" : undefined}`}
        tooltip={item.name}
      >
        <Link href={item.route}>
          {item.icon ? <item.icon /> : null}
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
