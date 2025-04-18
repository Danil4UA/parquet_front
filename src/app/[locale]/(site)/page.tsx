"use client";
import HomeHeader from "@/components/Home/HomeHeader/HomeHeader";
import HomeMain from "@/components/Home/HomeMain/HomeMain";
import "./home.css";

export default function HomePage() {
  return (
    <div className="HomePage_wapper">
      <HomeHeader />
      <HomeMain />
    </div>
  );
}
