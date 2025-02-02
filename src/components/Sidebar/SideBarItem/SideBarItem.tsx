import { Link } from "@/i18n/routing";
import { memo } from "react";
import { SidebarItemType } from "../model/items";
import "./SideBarItem.css";
import { useTranslations } from "next-intl";

interface SideBarItemProps {
  item: SidebarItemType;
  collapsed: boolean;
  onClose: () => void;
}

const SideBarItem = ({ item, onClose }: SideBarItemProps) => {
  const t = useTranslations("Sidebar");
  return (
    <>
      <Link className="SideBar__Item" onClick={() => onClose()} href={item.path}>
        {t(item.text)}
      </Link>
    </>
  );
};

export default memo(SideBarItem);
