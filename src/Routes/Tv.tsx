import { FaRegHeart, FaPlay, FaPlus } from "react-icons/fa";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  IGetMoviesResult,
  getLatestShows,
  getAiringToday,
  getPopular,
  getTopRated,
  getMoreDetail,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";

import {
  motion,
  AnimatePresence,
  useViewportScroll,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import SliderComponent from "../component/SliderTab";
import { Badge, Button, IconButton, Text } from "@chakra-ui/react";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
  font-weight: bold;
`;
const Overview = styled.p`
  font-size: 1.2vw; // 브라우저 크기에 따른 글자 조절
  width: 50%;
`;

const SliderBox = styled.div`
  position: relative;
  top: -100px;
  margin-left: 60px;
  margin-right: 60px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const SliderBoxItem = styled.div`
  position: relative;
  height: 280px;
`;

const Slider = styled.div``;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
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
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 101;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 35%,
    rgba(33, 33, 33, 1) 100%
  );
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const DetailTitles = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -250px;
  margin-left: 10px;
`;

const TopTitle = styled.div``;

const BigTitle = styled.h3`
  font-size: 60px;
  font-weight: bold;
  color: skyblue;
  display: inline;
`;
const SmallTitle = styled.h5`
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
  display: inline;
`;

const BigOverview = styled.p`
  padding: 20px;
  padding-bottom: 0px;
  position: relative;
  top: -240px;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: space-around;
`;
const BigOverviewLeft = styled.div`
  width: 50%;
`;
const BigOverviewRight = styled.div`
  width: 50%;
  text-align: right;
`;

const BigDetail = styled.p`
  margin: 20px;
  position: relative;
  top: -240px;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: space-around;
`;

//variables

const rowVariants = {
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
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const offset = 6;

// const Boxitem = styled.div<{ bgPhoto: string }>`
//   background: green;
//   flex: 0 0 19.7%;
//   text-align: center;
//   margin: 0 2px;
//   transition: transform 300ms ease 100ms;
//   background-position: center;
//   background-image: url(${(props) => props.bgPhoto});
//   background-size: cover;
//   &:hover {
//     transform: scale(1.08);
//   }
// `;

export default function TV() {
  // 최대 화면을 가운데 정렬하기 위한것.
  const { scrollY } = useScroll(); //스크롤 값을 가져와서
  const setScrollY = useTransform(scrollY, (value) => value + 50); // +50 해서 스크롤 값을 넘겨준다.

  const navigate = useNavigate();
  //const bigMovieMatch = useMatch<{ movieId: string }>("/movies/:movieId");

  const bigMovieMatch: PathMatch<string> | null = useMatch(
    "/tv/:movieId/:titleId"
  );

  const { data: dataLatestShows, isLoading: isLatestShowsLoading } =
    useQuery<IGetMoviesResult>(["tv", "LatestShows"], getLatestShows, {
      refetchOnWindowFocus: false,
    });

  const { data: dataAiringToday, isLoading: isAiringToday } =
    useQuery<IGetMoviesResult>(["tv", "AiringToday"], getAiringToday, {
      refetchOnWindowFocus: false,
    });

  const { data: dataPopular, isLoading: isPopular } =
    useQuery<IGetMoviesResult>(["tv", "Popular"], getPopular, {
      refetchOnWindowFocus: false,
    });

  const { data: dataTopRated, isLoading: isTopRated } =
    useQuery<IGetMoviesResult>(["tv", "TopRated"], getTopRated, {
      refetchOnWindowFocus: false,
    });

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  // const incraseIndex = () => {
  //   if (dataLatestShows) {
  //     if (leaving) return;
  //     toggleLeaving();
  //     const totalMovies = dataLatestShows.results.length - 1;
  //     const maxIndex = Math.floor(totalMovies / offset) - 1;
  //     setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  //   }
  // };

  const onBoxClicked = (movieId: number) => {
    //history.push(`/movies/${movieId}`);
    navigate(`/tv/${movieId}`);
  };

  const onOverlayClick = () => navigate("/tv");

  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   (dataLatestShows?.results.find(
  //     (movie) => movie.id === +bigMovieMatch.params.movieId!
  //   ) ||
  //     dataAiringToday?.results.find(
  //       (movie) => movie.id === +bigMovieMatch.params.movieId!
  //     ) ||
  //     dataPopular?.results.find(
  //       (movie) => movie.id === +bigMovieMatch.params.movieId!
  //     ));

  const { data: dataDetailInfo, isLoading: isDetailInfoLoading } =
    useQuery<IMovie>(
      ["DetailInfo", bigMovieMatch?.params.movieId],
      () =>
        getMoreDetail(
          "tv",
          bigMovieMatch?.params.movieId ? bigMovieMatch?.params.movieId : ""
        ),
      {
        refetchOnWindowFocus: false,
      }
    );

  // const clickedMovie = () => {
  //   if (bigMovieMatch?.params.movieId) {
  //     return dataLatestShows?.results.find(
  //       (movie) => movie.id === +bigMovieMatch.params.movieId!
  //     );
  //   } else {
  //     return "";
  //   }
  // };
  console.log(bigMovieMatch);

  return (
    <Wrapper>
      {isLatestShowsLoading || isAiringToday || isPopular || isTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              dataLatestShows?.results[0].backdrop_path || ""
            )}
          >
            <Title>{dataLatestShows?.results[0].title}</Title>
            <Overview>{dataLatestShows?.results[0].overview}</Overview>
          </Banner>

          <SliderBox>
            <SliderBoxItem>
              <SliderComponent
                title={"Latest movies"}
                data={dataLatestShows}
                category={"tv"}
              ></SliderComponent>
            </SliderBoxItem>
            <SliderBoxItem>
              <SliderComponent
                title={"AiringToday"}
                data={dataAiringToday}
                category={"tv"}
              ></SliderComponent>
            </SliderBoxItem>
            <SliderBoxItem>
              <SliderComponent
                title={"Popular"}
                data={dataPopular}
                category={"tv"}
              ></SliderComponent>
            </SliderBoxItem>
            <SliderBoxItem>
              <SliderComponent
                title={"TopRated"}
                data={dataTopRated}
                category={"tv"}
              ></SliderComponent>
            </SliderBoxItem>
            {/* <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <div>Popular Movies</div>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {dataPopular?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider> */}
          </SliderBox>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: setScrollY }}
                  layoutId={
                    bigMovieMatch.params.movieId! + bigMovieMatch.params.titleId
                  }
                >
                  {dataDetailInfo?.id && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(
                            
                            ${
                              dataDetailInfo?.backdrop_path
                                ? makeImagePath(
                                    dataDetailInfo.backdrop_path,
                                    "w500"
                                  )
                                : `${process.env.PUBLIC_URL}/img/nlogo2.jpg`
                            }

                            
                            )`,
                        }}
                      />
                      <DetailTitles>
                        <TopTitle>
                          <BigTitle>
                            {dataDetailInfo?.title
                              ? dataDetailInfo?.title
                              : dataDetailInfo?.name}
                          </BigTitle>
                          <SmallTitle>109 min</SmallTitle>
                        </TopTitle>
                        <TopTitle>
                          <Button
                            leftIcon={<FaPlay />}
                            colorScheme="gray"
                            variant="solid"
                          >
                            Play
                          </Button>
                          <IconButton
                            colorScheme="gray"
                            aria-label="Call Sage"
                            fontSize="20px"
                            ml="5px"
                            rounded={50}
                            icon={<FaPlus />}
                          />
                          <IconButton
                            colorScheme="pink"
                            aria-label="Call Sage"
                            fontSize="20px"
                            ml="5px"
                            rounded={50}
                            icon={<FaRegHeart />}
                          />
                        </TopTitle>
                      </DetailTitles>

                      <BigOverview>
                        <BigOverviewLeft>
                          <Text fontWeight="bold" m="2px;">
                            Original Title : {dataDetailInfo?.original_title}
                          </Text>
                          <Text m="2px;">
                            Popularity : {dataDetailInfo?.popularity}
                          </Text>
                          <Text m="2px;">IMDB : {dataDetailInfo?.imdb_id}</Text>
                        </BigOverviewLeft>
                        <BigOverviewRight>
                          <Text m="2px;">
                            {" "}
                            {dataDetailInfo?.genres ? (
                              <Badge colorScheme="green">
                                {dataDetailInfo?.genres[0].name}
                              </Badge>
                            ) : (
                              ""
                            )}
                          </Text>
                        </BigOverviewRight>
                      </BigOverview>
                      <BigDetail>{dataDetailInfo?.overview}</BigDetail>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
