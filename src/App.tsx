import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/" element={<Home />}></Route>

        <Route path="movies/:movieId/:titleId" element={<Home />}></Route>
        <Route path="tv/:movieId/:titleId" element={<Tv />}></Route>

        <Route
          path="search/:movieId/:titleId/:keywordId"
          element={<Search />}
        ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;

// 아이콘 애니메이션 테스트 한것.
// import styled from "styled-components";
// import { motion } from "framer-motion";

// const Wrapper = styled(motion.div)`
//   height: 100vh;
//   width: 100vw;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: black;
// `;

// const Svg = styled.svg`
//   width: 300px;
//   height: 300px;
//   path {
//     stroke: white;
//     stroke-width: 2;
//   }
// `;

// const svg = {
//   start: { pathLength: 0, fill: "rgba(255, 0, 0, 0)" },
//   end: {
//     fill: "rgba(255, 255, 255, 1)",
//     pathLength: 1, //아이콘 둘레의 border 두께를 이야기 한다.
//   },
// };

// function App() {
//   return (
//     <Wrapper>
//       <Svg
//         focusable="false"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//       >
//         <motion.path
//           variants={svg}
//           initial="start"
//           animate="end"
//           transition={{
//             // 여기서 default는 pathLength의 기본 시간을 이야기 하며 fill은 여기서 1과 3초의 딜레이를 따로 적용받는다.
//             default: { duration: 5 },
//             fill: { duration: 1, delay: 3 },
//           }}
//           d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
//         ></motion.path>
//       </Svg>
//     </Wrapper>
//   );
// }
// export default App;
