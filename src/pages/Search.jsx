import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import S from "./Search.module.css";
import SearchIcon from "/assets/search.png";
import XIcon from "/assets/x-icon.svg";
import XCircleIcon from "/assets/x-circle-icon.svg";
import { number } from "prop-types";
import pb from "@/api/pocketbase";
import { getPbImageURL } from "@/utils/getPbImageURL";
import "swiper/css";

//@ 검색창 부분 컴포넌트
function SearchSection({ searchData, setSearchData, setIsSearching }) {
	const handleInputChange = (e) => {
		setSearchData(e.target.value);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setIsSearching(true);
	};
	return (
		<div className={`${S.searchWrapper}`}>
			<form onSubmit={handleSearch} className="flex justify-between  w-full">
				{" "}
				<label htmlFor="search" className="sr-only">
					컨텐츠 검색
				</label>
				<input
					type="text"
					id="search"
					placeholder="제목, 인물명을 입력해보세요."
					className={`${S.searchInput} flex-grow`}
					value={searchData}
					onChange={handleInputChange}
				/>
				<button
					type="submit"
					className="w-[2.375rem] h-[2.375rem] bg-cover self-center ml-2"
					style={{ backgroundImage: SearchIcon && `url(${SearchIcon})` }}
				></button>
			</form>
		</div>
	);
}
//@ 리스트 부분 컴포넌트
function ListSection() {
	const recentView = [
		{ id: 1, title: "신병" },
		{ id: 2, title: "아스날 연대기" },
	];
	const realtimeSearch = [
		{ id: 1, title: "신병" },
		{ id: 2, title: "아스달 연대기" },
		{ id: 3, title: "스트릿 우먼 파이터 시즌2" },
		{ id: 4, title: "나는 SOLO" },
		{ id: 5, title: "남남" },
		{ id: 6, title: "아스달 여대기" },
		{ id: 7, title: "짱구는 못말려23" },
		{ id: 8, title: "아라문의 검" },
		{ id: 9, title: "뭉쳐야 찬다2" },
		{ id: 10, title: "힙하게" },
	];
	return (
		<div className={`${S.listWrapper}`}>
			<div className={`${S.recentViewWrapper}`}>
				<div className="flex items-center">
					<h3 className="text-[#dedede] text-3xl">최근 검색어</h3>
					<button className="text-[1.175rem] font-normal text-[gray] leading-[normal] ml-[1.174rem] inline-flex pt-1">
						<span>모두 지우기</span>
						<span
							style={{
								backgroundImage: `url(${XCircleIcon})`,
								position: "relative",
							}}
							className="w-[1.175rem] h-[1.175rem] inline-block bg-no-repeat bg-[50%_50%] bg-contain ml-[0.5rem] pt-[0.5rem] leading-normal"
						></span>
					</button>
				</div>
				{recentView?.length > 0 ? (
					<ul className="w-full mt-8">
						{recentView.map((view) => (
							<RecentView key={view.id} view={view} />
						))}
					</ul>
				) : (
					<div className="text-slate-300 mt-8 text-xl">
						검색 내역이 없습니다.
					</div>
				)}
			</div>
			<div className={`${S.popularViewWrapper}`}>
				<h3 className="text-[#dedede] text-3xl">실시간 검색어</h3>
				<ul className="mt-8">
					{realtimeSearch &&
						realtimeSearch.map((item) => (
							<RealtimeSearch key={item.id} item={item} />
						))}
					<CurrentTime className="" />
				</ul>
			</div>
		</div>
	);
}
//@ 현재 시간 표시 컴포넌트
function CurrentTime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1; // 월은 0부터 시작하므로 +1을 해줍니다.
	const date = now.getDate();

	let hours = now.getHours();
	let minutes = now.getMinutes();

	// AM/PM 표시를 위해 시간을 조정합니다.
	const ampm = hours >= 12 ? "오후" : "오전";

	//12시간제로 변경
	hours %= 12;
	hours = hours ? hours : 12; //0시는 보통 "12"로 표기하기 때문에

	// 분이 한 자리수일 경우 앞에 "0"을 붙여줍니다.
	minutes = minutes < 10 ? "0" + minutes : minutes;

	return (
		<span className="block mt-4 mb-4 font-[0.75rem] text-[#646464]">
			{`${year}.${month}.${date} ${ampm} ${hours}:${minutes} 기준`}
		</span>
	);
}

//@ 최근 검색어 컴포넌트
function RecentView({ view }) {
	return (
		<li key={view.id} className="mt-2">
			<button className="whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer text-[#a6a6a6] text-[1.25rem]">
				{view.title}
			</button>
			<button
				className="min-w-[1rem] min-h-[1rem] bg-no-repeat bg-[50%_50%] opacity-70 leading-[normal] text-base cursor-pointer align-middle ml-4 pb-2"
				style={{
					backgroundImage: `url(${XIcon})`,
					position: "relative",
					bottom: "2px",
				}}
			></button>
		</li>
	);
}
//@ 인기 검색어 컴포넌트
function RealtimeSearch({ item }) {
	return (
		<li
			key={item.id}
			className="list-none m-2 text-lg text-gray-300 transition-colors duration-100 leading-relaxed"
		>
			<button
				type="button"
				className="bg-transparent cursor-pointer flex items-center text-gray-400 transition-colors duration-100 ease-linear"
			>
				<span className="text-left font-normal text-lg inline-block text-red-500">
					{item.id}
				</span>
				<h3 className="p-0 ml-5 my-1.5 cursor-pointer text-xl text-[#a6a6a6]">
					{item.title}
				</h3>
			</button>
		</li>
	);
}

//@ 검색결과 컴포넌트
function SearchResult({ status, contents, error }) {
	if (status === "loading") {
		return <div>로딩중 입니다...</div>;
	}
	if (status === "error") {
		return (
			<div role="alert">
				<h2>{error.type}</h2>
				<p>{error.message}</p>
			</div>
		);
	}
	return (
		<div className={`${S.searchResultWrapper}`}>
			{contents.map(
				(contentCategory) =>
					contentCategory.data.length > 0 && (
						<div
							key={contentCategory.title}
							className={`${S.searchResult} my-5 w-full h-full`}
						>
							<h3 className={`${S.resultTitle}`}>{contentCategory.title}</h3>
							<Swiper
								slidesPerView={6}
								spaceBetween={10}
								className="mySwiper w-full"
							>
								{contentCategory.data.map((content) => (
									<SwiperSlide key={content.id} className="inline-block h-1/4">
										<img
											src={getPbImageURL(content, "poster")}
											alt={content.title}
											className="transition-opacity duration-100 ease-in-out inline-block"
										/>
										<p className="py-2 mt-2 text-white text-lg text-left">
											{content.title}
										</p>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					)
			)}
		</div>
	);
}

function Search() {
	const [searchData, setSearchData] = useState("");
	const [contents, setContents] = useState(null);
	const [status, setStatus] = useState("pending");
	const [error, setError] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	useEffect(() => {
		if (!searchData) return; //? 검색어가 없을 경우 요청하지 않습니다.

		setStatus("loading");

		//@ program, movie 컬렉션에서 한 번에 데이터 요청
		Promise.all([
			pb
				.collection("program")
				.getFullList({ filter: `title ~ "${searchData}"` }),
			pb.collection("movie").getFullList({ filter: `title ~ "${searchData}"` }),
		])
			.then(([programList, movieList]) => {
				setContents([
					{ title: "TV 프로그램", data: programList },
					{ title: "영화", data: movieList },
				]);
				setStatus("success");
			})
			.catch((error) => {
				setError(error);
				setStatus("error");
			});
	}, [searchData]);

	return (
		<>
			<Helmet>
				<title>Search - Taing</title>
			</Helmet>
			<div className={`${S.container}`}>
				<div className={`${S.main} `}>
					<SearchSection
						searchData={searchData}
						setSearchData={setSearchData}
						setIsSearching={setIsSearching}
					/>
					{isSearching ? (
						<SearchResult status={status} contents={contents} error={error} />
					) : (
						<ListSection />
					)}
				</div>
			</div>
		</>
	);
}

//RecentView.propTypes = {
//	view: propTypes.shape({
//		id: number.isRequired,
//		title: string.isRequired,
//	}),
//};

//RealtimeSearch.propTypes = {
//	item: PropTypes.shape({
//		id: number.isRequired,
//		title: string.isRequired,
//	}),
//};

export default Search;
