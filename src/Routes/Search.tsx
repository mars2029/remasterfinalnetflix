// import { useLocation } from "react-router";

// function Search() {
//   const location = useLocation(); // 현재 URL값을 가져온다.
//   //  {search : "?keyword=test",pathname :  "/search" }

//   console.log(location);
//   const keyword = new URLSearchParams(location.search).get("keyword");
//   // 키워드의 값을 가져온다.
//   console.log(keyword);
//   return null;
// }
// export default Search;
import { FaRegHeart, FaPlay, FaPlus } from "react-icons/fa";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  IGetMoviesResult,
  getSearchMovie,
  getSearchTv,
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
import { useEffect, useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import SliderComponent from "../component/SliderTab";
import { useLocation } from "react-router";
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
  height: 81vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 60px;
  background-color: black;
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

export default function Search() {
  // 이부분은 home과 마찬가지로  2개의 useQuery를 이용해 movie와 tv 리스트를 가져온다.
  // 그리고 물론 접속 방법이 /search?keyword=test 이기 때문에
  // Detailinfo는 null이 된다.
  // 하지만 고려해야 할 점이 이전과 다르게 검색은  /search?keyword=test 의 keyword가 붙는다는것이다.

  // 다시 정리하면 /search?keyword=test 로 접근하면
  // 두개의 movie와 tv 리스트를 가져오게 되며 이들은 매번 키워드를 가져와 useEffect에서
  // 페이지를 강제로 갱신시켜 리스트를 동기화 하게 된다.
  // 이렇게 하지 않으면 캐시 데이터가 있기에 자동으로 동기화 하지 않으며 이러면 새로운 검색에서 멈추게 된다.
  // 다른 커뮤니티에서는 key값 (["searchMovie", "movie"], )을 입력시켜 갱신 시키라고 하지만
  // key값을 keyword로 적용시 디테일 아이템을 클릭해서 주소를 "/search/:movieId/:titleId/:keywordId"
  // 와 같이 이동하면 기존의 캐시값이 없어지는 문제가 발생하게 된다.

  // "/search/:movieId/:titleId/:keywordId" 로 페이지 이동시
  // 기존의 useQuery도 업데이트 되는것 아니냐고 생각 될 수 있겠지만
  // 결론적으로는 아니다. 왜냐하면 기본적으로
  // "/search/200874/Tv/title?keyword=modern"나
  // "/search?keyword=modern"에서
  // 공통적인 검색어인 keyword라는 값을 같은 값을 넘기기 때문이다.
  // useEffect는 keyword를 지켜보는데 키워드가 같으면 업데이트를 하지 않는다.
  // 그렇기에 "/search/:movieId/:titleId/:keywordId" 로 접근해도 기존의 2가지useQuery는 갱신하지 않고
  // detail info 만 가져와 화면에 뿌려주게 되는 것이다.

  // <Route path="/search" element={<Search />}></Route>
  // <Route path="search/:movieId/:titleId/:keywordId" element={<Search />}

  const { scrollY } = useScroll(); //스크롤 값을 가져와서
  const setScrollY = useTransform(scrollY, (value) => value + 50); // +50 해서 스크롤 값을 넘겨준다.
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(-1);

  const location = useLocation(); // 현재 URL값을 가져온다.
  const keyword = new URLSearchParams(location.search).get("keyword"); // 키워드의 값을 가져온다.

  const {
    data: dataSearchResult,
    isLoading: isSearchResultLoading,
    refetch,
  } = useQuery<IGetMoviesResult>(
    ["searchMovie", "movie"],
    () => getSearchMovie(keyword ? keyword : ""),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: dataSearchTvResult,
    isLoading: isSearchTvResultLoading,
    refetch: tvRefetch,
  } = useQuery<IGetMoviesResult>(
    ["searchTv", "tv"],
    () => getSearchTv(keyword ? keyword : ""),
    {
      refetchOnWindowFocus: false,
    }
  );

  //
  useEffect(() => {
    refetch(); // wrap with debounce function to not call on every change
    tvRefetch();
  }, [keyword]);

  const bigMovieMatch: PathMatch<string> | null = useMatch(
    "/search/:movieId/:titleId/:keywordId"
  );

  const { data: dataDetailInfo, isLoading: isDetailInfoLoading } =
    useQuery<IMovie>(
      ["DetailInfo", bigMovieMatch?.params.movieId],
      () =>
        getMoreDetail(
          bigMovieMatch?.params.titleId
            ? bigMovieMatch?.params.titleId.toLowerCase()
            : "",
          bigMovieMatch?.params.movieId ? bigMovieMatch?.params.movieId : ""
        ),
      {
        refetchOnWindowFocus: false,
      }
    );

  // console.log(bigMovieMatch?.params.movieId);
  // console.log(dataDetailInfo?.backdrop_path);
  // console.log(bigMovieMatch?.params.movieId);
  // console.log(clickedMovie);
  // console.log(dataSearchResult);
  // console.log(bigMovieMatch);
  return (
    <Wrapper>
      {isSearchResultLoading ? (
        <Loader>Loading...</Loader>
      ) : dataSearchResult?.total_results !== 0 ? (
        <>
          <Banner
            bgPhoto={
              dataSearchResult?.results[0].backdrop_path
                ? makeImagePath(
                    dataSearchResult?.results[0].backdrop_path || ""
                  )
                : `${process.env.PUBLIC_URL}/img/nlogo2.jpg`
            }
          >
            <Title>Search Result</Title>
            <Overview>Netflix Search Results</Overview>
          </Banner>

          <SliderBox>
            <SliderBoxItem>
              <SliderComponent
                title={"Movie"}
                data={dataSearchResult as IGetMoviesResult}
                category={"search"}
              ></SliderComponent>
            </SliderBoxItem>
            <SliderBoxItem>
              <SliderComponent
                title={"Tv"}
                data={dataSearchTvResult as IGetMoviesResult}
                category={"search"}
              ></SliderComponent>
            </SliderBoxItem>
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
      ) : (
        <>
          <Banner bgPhoto={`${process.env.PUBLIC_URL}/img/nlogo.png`}>
            <Title>Search Result</Title>
            <Overview>No Data</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}
