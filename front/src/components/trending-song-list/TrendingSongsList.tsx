import React, { useEffect, useState } from "react";
import { getTrendingSongs } from "../../service/trendingService.ts";
import TrackModal from "../TrackModal.tsx";
import type { Track } from "../../types/track.ts";

// Імпортуємо Swiper та його стилі
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const TrendingSongsList: React.FC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    useEffect(() => {
        let isMounted = true;
        getTrendingSongs(40)
            .then((data) => {
                if (isMounted) {
                    const mapped = (data ?? []).map(track => ({
                        ...track,
                        duration: track.duration ?? 0,
                        release_date: track.release_date ?? null,
                        rank: track.rank ?? 0
                    }));
                    setTracks(mapped);
                }
            })
            .catch(() => { if (isMounted) setTracks([]); });
        return () => { isMounted = false; };
    }, []);

    const getArtistName = (track: Track) => {
        if (!track.artist) return "Unknown Artist";
        return typeof track.artist === "string" ? track.artist : track.artist.name ?? "Unknown Artist";
    };

    const initialDisplayCount = 7; // Повертаємо 7, як ти й хотіла
    const displayedTracks = tracks.slice(0, initialDisplayCount);
    const remainingTracks = tracks.slice(initialDisplayCount);

    const TrackCard = ({ track }: { track: Track }) => (
        <div
            onClick={() => setSelectedTrack(track)}
            className="relative w-full h-[214px] flex flex-col justify-center items-center px-[15px] py-[4px] rounded-[10px] bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer transition"
        >
            <div className="w-full h-[150px] rounded-[10px] bg-gray-700 overflow-hidden">
                {track.cover && <img src={track.cover} alt={track.name} className="w-full h-full object-cover" />}
            </div>
            <p className="w-full mt-2 text-white font-vazirmatn text-[16px] font-[500] text-left overflow-hidden whitespace-nowrap text-ellipsis">
                {track.name}
            </p>
            <p className="w-full text-white font-vazirmatn text-[12px] font-[300] text-left opacity-80 overflow-hidden whitespace-nowrap text-ellipsis">
                {getArtistName(track)}
            </p>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 relative w-full pt-[50px]">

            {/* ## 🖥️ ВЕРСІЯ ДЛЯ ДЕСКТОПУ ## */}
            <div className="hidden xl:block">
                {/* ✨ ЗМІНА: Тепер це батьківський flex-контейнер */}
                <div className="flex w-full items-center ">
                    {/* Контейнер для треків, який буде розширюватися */}
                    <div className="flex flex-nowrap gap-6">
                        {displayedTracks.map(track => (
                            <div key={track.id} className="w-[175px] shrink-0"><TrackCard track={track} /></div>
                        ))}
                    </div>

                    {/* Кнопка "View All" з ml-auto, яка прилипне до правого краю */}
                    {!showAll && remainingTracks.length > 0 && (
                        <div className="flex flex-col items-center justify-center cursor-pointer w-[175px] shrink-0 " onClick={() => setShowAll(true)}>
                            <div className="w-[62px] h-[62px] flex justify-center items-center rounded-full bg-[#1E1E1E]">
                                <img src="assets/icon/plus.png" className="w-[24px] h-[24px]" alt="View all" />
                            </div>
                            <p className="w-fit text-white font-vazirmatn text-[16px] font-medium text-center mt-2">View All</p>
                        </div>
                    )}
                </div>

                {/* Блок з рештою треків */}
                {showAll && remainingTracks.length > 0 && (
                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex flex-wrap justify-start gap-6">
                            {remainingTracks.map(track => (
                                <div key={track.id} className="w-[175px]"><TrackCard track={track} /></div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button onClick={() => setShowAll(false)} className="px-6 py-2 rounded-lg cursor-pointer text-white font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition">
                                Hide
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ## 📱 ВЕРСІЯ ДЛЯ МОБІЛЬНИХ ## */}
            <div className="xl:hidden">
                <Swiper slidesPerView={'auto'} spaceBetween={16} className="w-full">
                    {tracks.map(track => (
                        <SwiperSlide key={track.id} style={{ width: '175px' }}>
                            <TrackCard track={track} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {selectedTrack && <TrackModal track={selectedTrack} onClose={() => setSelectedTrack(null)} />}
        </div>
    );
};

export default TrendingSongsList;