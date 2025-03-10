import Link from "next/link";

const menuItems = [
  { title: "Create Quiz", route: "/create-quiz" },
  { title: "Quizzes", route: "/quizzes" },
  { title: "Mistakes", route: "/mistakes" },
  { title: "Statistics", route: "/statistics" },
  { title: "Leaderboard", route: "/leaderboard" },
];

const MainPage = () => {
  return (
    <div className="w-full px-20 pt-10 mx-auto grid grid-cols-3 gap-6">
      {menuItems.map(({ title, route }, index) => (
        <Link key={index} href={route} passHref>
          <div className="h-40 bg-[url('/assets/images/decoration/main-page-block-bg.svg')] bg-cover bg-center rounded-xl flex flex-col items-center justify-center text-white cursor-pointer transition-transform hover:scale-105">
            <h2 className="underline text-2xl font-bold uppercase text-center">
              {title}
            </h2>
            <p className="text-center">
              Lorem ipsum dolor amet
              <br />
              Lorem ipsum dolor amet
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MainPage;
