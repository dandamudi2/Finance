import Header from "@/components/Header";

type Props = {
  children: React.ReactNode;
};

const DashBoardLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div className="px-3 lg:px-14">
        {children}
      </div>
    </>
  );
};

export default DashBoardLayout;
