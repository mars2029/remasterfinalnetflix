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
import { IGetMoviesResult } from "../api";

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
    cursor: pointer;
    scale: 1.1;
    background-color: rgba(0, 0, 0, 0.7);
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
    cursor: pointer;
    scale: 1.1;
    background-color: rgba(0, 0, 0, 0.7);
  }
`;
//variables

const rowVar = {
  hidden: (direction: number) => {
    return {
      x: direction === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (direction: number) => {
    return {
      x: direction === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
    };
  },
};

// const rowVariantsRight = {
//   hidden: {
//     x: window.outerWidth + 5,
//   },
//   visible: {
//     x: 0,
//   },
//   exit: {
//     x: -window.outerWidth - 5,
//   },
// };

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

interface ISlider {
  title: string;
  data: IGetMoviesResult;
  category: string;
}

export default function SliderComponent({ title, data, category }: ISlider) {
  // 수정해 볼것.

  const navigate = useNavigate();

  const location = useLocation(); // 현재 URL값을 가져온다.
  const keyword = new URLSearchParams(location.search).get("keyword");

  const toggleLeaving = () => setLeaving((prev) => !prev); //onExitComplete 에 넣어서 exit의 애니메이션이 끝나고 나서 함수가 실행되게함

  const [index, setIndex] = useState(0); //슬라이더 인덱스
  const [leaving, setLeaving] = useState(false); //슬라이더 상태
  const [arrowDirection, setArrowDirection] = useState(1);

  const incraseIndex = (direction: number) => {
    if (data) {
      if (leaving) return;
      // leaving이 true이면 리턴(아무것도 하지않음) 클릭을 여러번 연속으로 하면
      // 간격이 벌어지는 버그 수정하기 위해 인덱스 증가 안되게함
      toggleLeaving();

      setArrowDirection(direction);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
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
        <ArrowLeft onClick={() => incraseIndex(-1)}>
          <Icon as={FaAngleLeft} boxSize={6} />
        </ArrowLeft>
        <ArrowRight onClick={() => incraseIndex(1)}>
          <Icon as={FaAngleRight} boxSize={6} />
        </ArrowRight>
        <AnimatePresence
          custom={arrowDirection}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row
            custom={arrowDirection}
            variants={rowVar}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results

              .slice(offset * index, offset * index + offset)
              .map((movie) => (
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
