import React from "react";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ liked, likes, onClick, disabled = false }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition duration-200 ${
				liked
					? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200"
					: "text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-900/40 dark:hover:text-rose-200"
			}`}
			aria-label={liked ? "Unlike post" : "Like post"}
			disabled={disabled}
		>
			<FaHeart
				size={17}
				className={`transition duration-200 ${
					liked
						? "text-rose-500 dark:text-rose-300"
						: "text-slate-400 group-hover:text-rose-500 dark:text-slate-500 dark:group-hover:text-rose-300"
				}`}
			/>
			<span>{likes}</span>
		</button>
	);
};

export default LikeButton;
