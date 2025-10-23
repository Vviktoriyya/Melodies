import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import type { Track } from "../types/track.ts";

import favoriteIcon from "/assets/icon/favorite.png";
import favoriteSavedIcon from "/assets/icon/favoriteSaved.png";
import { useFavorites } from "../pages/favorites/hooks/useFavorites.ts";

interface TrackModalProps {
    track: Track;
    onClose: () => void;
}

const TrackModal: React.FC<TrackModalProps> = ({ track, onClose }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const favorite = isFavorite(track.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (favorite) removeFavorite(track.id);
        else addFavorite({
            ...track,
            duration: track.duration ?? 0,
            release_date: track.release_date ?? new Date().toISOString(),
            rank: track.rank ?? 0,
            addedAt: new Date().toISOString(),
        });
    };

    const getArtistName = (track: Track) => {
        if (!track.artist) return "Unknown Artist";
        return typeof track.artist === "string" ? track.artist : track.artist.name ?? "Unknown Artist";
    };

    const favoriteButton = (
        <button
            onClick={handleFavoriteClick}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            className="group relative flex items-center justify-center rhap_button-clear"
        >
            <img
                src={favorite ? favoriteSavedIcon : favoriteIcon}
                className={`w-6 h-6 transition-all duration-300 ${ 
                    favorite
                        ? "scale-110 brightness-125 drop-shadow-[0_0_10px_#ff477e]"
                        : "opacity-70 group-hover:opacity-100"
                }`}
                alt="Favorite"
            />
        </button>
    );

    const listenFullButton = (
        <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.title} ${getArtistName(track)}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Listen full version on YouTube"
            className="rhap_button-clear z-[10] text-sm font-semibold text-gray-400 hover:text-white transition-colors no-underline"
            onClick={(e) => e.stopPropagation()}
        >
            Full
        </a>
    );


    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#181818] rounded-2xl p-6 w-[400px] flex flex-col items-center text-white"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-xl font-bold hover:text-red-500 transition"
                >
                    <img
                        src="assets/icon/cancel.png"
                        className="w-[25px] cursor-pointer invert brightness-200 hover:opacity-80 transition"
                        alt="."
                    />
                </button>

                {track.cover && <img src={track.cover} alt={track.name} className="w-[250px] h-[250px] object-cover rounded-xl mb-4" />}

                <div className="text-center mb-2">
                    <h1 className="text-xl font-bold">{track.title}</h1>
                    <p className="text-gray-400">{getArtistName(track)}</p>
                </div>

                {(track?.full || track?.preview) && (
                    <div className="w-full flex flex-col items-center mt-2">

                        <AudioPlayer
                            src={track?.full ?? track?.preview ?? undefined}
                            layout="stacked-reverse"
                            showSkipControls={false}
                            showJumpControls={false}
                            autoPlayAfterSrcChange={true}
                            className="w-full rounded-xl audio-player-custom"
                            customAdditionalControls={[
                                <div key="custom-controls" className="flex items-center gap-x-2">
                                    {favoriteButton}
                                    {listenFullButton}
                                </div>
                            ]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackModal;