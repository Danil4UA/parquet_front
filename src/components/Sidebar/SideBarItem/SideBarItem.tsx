import { Link } from "@/i18n/routing";
import { memo } from "react";
import { SidebarItemType } from "../model/items";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface SideBarItemProps {
  item: SidebarItemType;
  collapsed: boolean;
  onClose: () => void;
}

const SideBarItem = ({ item, onClose }: SideBarItemProps) => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const pathWithoutLang = pathname.replace(`/${lng}`, '') || '/';

  const isActive = (() => {
    if (item.path === '/') {
      return pathWithoutLang === '/';
    }
    
    if (item.exactMatch) {
      return pathWithoutLang === item.path;
    }
    
    return pathWithoutLang.includes(item.path);
  })();
  
  const handleClick = () => {
    onClose();
  };

  return (
    <Link 
      href={item.path} 
      onClick={handleClick}
      className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-gray-900 text-white' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <span className="font-medium">
        {t(item.text)}
      </span>
      
      <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
        isHebrew ? 'rotate-180' : ''
      } ${
        isActive 
          ? 'text-white' 
          : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
      } group-hover:translate-x-0.5`} />
    </Link>
  );
};

export default memo(SideBarItem);