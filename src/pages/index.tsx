import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Hero from "@/components/Home/Hero";
import Quickaction from "@/components/Home/Quickaction";
import CarBrands from "@/components/Home/CarBrands";
import AppPromotion from "@/components/Home/AppPromotion";
import ServiceCards from "@/components/Home/ServiceCards";
import CarCategories from "@/components/Home/CarCategories";
import FeaturedCars from "@/components/Home/FeaturedCars";
import CustomerReviews from "@/components/Home/CustomerReviews";
import MaintenanceCostEstimator from "@/components/Home/Maintenence_CostEstimator";
import Collapsible from "@/components/ui/Collapsible";
import NotificationPreferences from "@/components/NotificationPreferences";
import DynamicPricing from "@/components/Home/DynamicPricing";
import SearchBar from "@/components/Home/SearchBar";
import GeoFence from "@/components/Home/GeoFence";
import ReferralWallet from "@/components/Home/ReferralWallet";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-white">
        <Quickaction />
        <CarBrands />
        <AppPromotion />
        <ServiceCards />
        <CarCategories />
        <FeaturedCars />
        <CustomerReviews />

        <Collapsible title="Notification Preferences">
          <div className="bg-[#0f0f13] rounded-2xl">
            <NotificationPreferences />
          </div>
        </Collapsible>

        <Collapsible title="Maintenance Cost Estimator">
          <MaintenanceCostEstimator />
        </Collapsible>

        <Collapsible title="Dynamic Pricing">
          <DynamicPricing />
        </Collapsible>

        <Collapsible title="Search Cars">
          <SearchBar />
        </Collapsible>

        <Collapsible title="Cars Near You">
          <GeoFence />
        </Collapsible>

        <Collapsible title="Referral & Wallet">
          <ReferralWallet />
        </Collapsible>
      </div>
    </div>
  );
}
