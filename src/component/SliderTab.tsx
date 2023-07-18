import styled from "styled-components";
import { makeImagePath } from "../utils";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  PathMatch,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import { Button, Icon } from "@chakra-ui/react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Row = styled(motion.div)`
  display: grid;
  margin: 15px;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;

const BoxTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 5px;
  margin-top: 10px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  border-radius: 5px;
  background-color: black;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const ArrowLeft = styled.div`
  position: absolute;
  width: 120px;
  height: 80%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  left: -80px;
  cursor: pointer;
  &:hover {
    font-size: 20px !important;
  }
`;

const ArrowRight = styled.div`
  position: absolute;
  right: 0px;
  width: 120px;
  height: 80%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  right: -80px;
  cursor: pointer;
  &:hover {
    font-size: 20px;
  }
`;
//variables

const rowVariants = {
  hidden: {
    x: -window.outerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth + 5,
  },
};

const rowVariantsRight = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.1,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const offset = 6;

export default function SliderComponent({ title, data, category }: any) {
  const navigate = useNavigate();

  const location = useLocation(); // 현재 URL값을 가져온다.
  const keyword = new URLSearchParams(location.search).get("keyword");

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [arrowDirection, setArrowDirection] = useState(false);

  console.log(index);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();

      setArrowDirection((prev) => true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();

      setArrowDirection((prev) => false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };

  // 아이템을 클릭했을때 세부 정보 표시를 위해 새로운 url로 이동하라고 하는것.
  // 이동 해도 기존의 useQuery를 사용하기에 뒤에 있는 데이터는 같으며
  // 앞의 데이터만 적용되어 화면에 뿌려주게 된다.
  // 그냥 단순히 "/" 의 페이지와 "/movies/:movieId/:titleId" 페이지는 다르다고 생각해라.
  const onBoxClicked = (movieId: number) => {
    //history.push(`/movies/${movieId}`);
    if (category === "search") {
      navigate(`/${category}/${movieId}/${title}/title?keyword=${keyword}`);
    } else {
      navigate(`/${category}/${movieId}/${title}`);
    }
  };

  return (
    <>
      <BoxTitle>{title}</BoxTitle>
      <div>
        <ArrowLeft onClick={incraseIndex}>
          <Icon as={FaAngleLeft} boxSize={6} />
        </ArrowLeft>
        <ArrowRight onClick={decraseIndex}>
          <Icon as={FaAngleRight} boxSize={6} />
        </ArrowRight>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariantsRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results

              .slice(offset * index, offset * index + offset)
              .map((movie: any) => (
                <Box
                  layoutId={movie.id + title}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie.id)}
                  transition={{ type: "tween" }}
                  bgPhoto={
                    movie.backdrop_path
                      ? makeImagePath(movie.backdrop_path, "w500")
                      : `${process.env.PUBLIC_URL}/img/nlogo2.jpg`
                  }
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.name ? movie.name : movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </div>
    </>
  );
}
