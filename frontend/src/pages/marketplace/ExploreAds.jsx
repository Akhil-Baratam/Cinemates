import React from "react";
import PostAdModal from "./components/PostAdModal";
import Ads from "./components/Ads";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import AdSidebar from "./components/AdSidebar";
import MyAds from "./components/MyAds";
import Ad from "./components/Ad";

const ExploreAds = () => {
  return (
    <section className="flex h-screen">
      {/* Left Sidebar - Fixed width 64px */}
      <div className=" flex-none w-64 bg-white h-full left-0 border border-r border-[#bdbaba]">
        <AdSidebar />
      </div>

      {/* Middle Content - Auto width */}
      <div className=" grow w-[300px] bg-black bg-opacity-5">
        <MyAds />
      </div>

      {/* Right Sidebar - Fixed width 200px */}
      <div className=" lg:block hidden flex-none w-[400px] bg-white overflow-y-auto right-0 border border-l border-[#bdbaba] h-full">
        <Ad />
      </div>
    </section>
  );
};

export default ExploreAds;
