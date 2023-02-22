import Navbar from "./Navbar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="container mx-auto divide-y divide-gray-200 px-4 dark:divide-gray-700">
      <Navbar />
      {children}
    </div>
  );
}
