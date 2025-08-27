import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CartLoader from "@/components/CartLoader/CartLoader";
import ProductFilterLoader from "@/components/Products/ui/ProductFilterLoader/ProductFilterLoader";
import ClientCart from "@/components/Cart/ui/ClientCart/ClientCart";
import ContactButton from "@/components/ContactButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartLoader />
      <ProductFilterLoader />
      <Navbar />
      <ClientCart />
      <div className="content-page">
        <div className="page-wrapper">{children}</div>
      </div>
      <Footer />
      <ContactButton />
    </>
  );
}