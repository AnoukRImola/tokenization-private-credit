import { HomeView } from "@/features/home/HomeView";
import { Header } from "@/components/shared/Header";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#def1f8]">
      <div className="container relative z-10 mx-auto">
        <Header />
        <HomeView />
      </div>
    </div>
  );
}
