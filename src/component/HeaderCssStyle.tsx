// 반응형 웹이지만 메뉴가 밑으로 나옴 display: none 이용한것.

import styled from "styled-components";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useMatch } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

import { FaBars } from "react-icons/fa";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
  background-color: black;
  @media ${(props) => props.theme.mobile} {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 24px;
  }
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;

const ColMenu = styled.div`
  width: 100vw;
  display: flex;
  justify-content: flex-start;
  padding-left: 0;
  list-style: none;
  @media ${(props) => props.theme.mobile} {
    /* display: none; */
    display: none;
    flex-direction: column;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    &.active {
      display: flex;
    }
  }
`;
const Items = styled.ul`
  display: flex;
  align-items: center;

  @media ${(props) => props.theme.mobile} {
    /* display: none; */
    flex-direction: column;
  }
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }

  @media ${(props) => props.theme.mobile} {
    /* display: none; */
    padding: 10px;
    &:hover {
      color: ${(props) => props.theme.white.lighter};
      background-color: #615c58;
      width: 100vw;
    }
  }
`;
const Search = styled.span`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
  @media ${(props) => props.theme.mobile} {
    /* display: none; */
    padding: 0px;
    top: 9px;
    position: absolute;
    right: 50px;
  }
`;
const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;
const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 4px 0px;
  padding-left: 30px;
  width: 200px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const BurgerBar = styled.button`
  display: none;
  position: absolute;
  right: 12px;
  font-size: 24px;
  padding-top: 5px;
  color: white;
  @media ${(props) => props.theme.mobile} {
    padding-top: 0px;
    display: block;
  }
`;

//로고에 들어가는 애니메이션 설정.
const logoVariants = {
  start: { pathLength: 0, fill: "rgba(0,0,0,0)" },
  end: {
    pathLength: [1, 0],
    fill: "rgba(255,0,0,1)",
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  scroll: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
};

export default function Header() {
  //useRouteMatch가 useMatch로 변경되었습니다
  // 이 또한 상대경로로 작성하는 것으로 변경되었습니다
  // ex. useRouteMatch('/tv') -> useMatch('tv')
  const locHome = useMatch("/");
  const locTv = useMatch("tv");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  //const { scrollY } = useViewportScroll();   "useViewportScroll" 은 "useScroll" 로 변경되었습니다!

  const { scrollY } = useScroll();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (scrollY.get() > 80) {
      navAnimation.start("scroll");
    } else {
      navAnimation.start("top");
    }
  });

  const onClickBurger = (event: React.MouseEvent<HTMLButtonElement>) => {
    const menu = document.querySelector(".navbar__menu");
    const icons = document.querySelector(".navbar__icons");
    menu?.classList.toggle("active");
    icons?.classList.toggle("active");

    return;
  };

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={"top"}>
      <Col>
        <Logo
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path
            variants={logoVariants}
            initial="start"
            animate="end"
            transition={{
              default: { pathLength: 0, duration: 4 },
              fill: { duration: 1, delay: 1.5 },
            }}
            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
          />
        </Logo>
      </Col>
      <ColMenu className="navbar__menu">
        <Items>
          <Item>
            {/* Link에서 to는 상대경로로 적으시면 됩니다 ex. '/tv' -> 'tv' */}
            <Link to={`${process.env.PUBLIC_URL}/`}>
              Home
              {locHome ? <Circle layoutId="circle" /> : ""}
            </Link>
          </Item>
          <Item>
            <Link to={`${process.env.PUBLIC_URL}/tv`}>
              Tv Shows
              {locTv ? <Circle layoutId="circle" /> : ""}
            </Link>
          </Item>
        </Items>
      </ColMenu>
      <Col className="navbar__search">
        <Search>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -172 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            // transition={{ type-> ease: 'linear' }} 으로 수정 하니 정상 동작 합니다.
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ ease: "linear" }}
            placeholder="Search"
          />
        </Search>
      </Col>
      <BurgerBar
        style={{ backgroundColor: "transparent", border: "none" }}
        onClick={onClickBurger}
        className="navbar__toggleBtn"
      >
        <FaBars></FaBars>
      </BurgerBar>
    </Nav>
  );
}
