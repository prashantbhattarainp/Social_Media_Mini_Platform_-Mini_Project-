import React from "react";
import Button from "./Button.jsx";

const CommentBox = ({ value, onChange, onSubmit, disabled = false, submitLabel = "Comment", maxLength = 1000 }) => {
	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
			<input
				className="input-field flex-1"
				placeholder="Write a comment..."
				value={value}
				onChange={onChange}
				disabled={disabled}
				maxLength={maxLength}
			/>
			<Button type="submit" className="sm:min-w-[120px]" disabled={disabled || !value.trim()}>
				{submitLabel}
			</Button>
		</form>
	);
};

export default CommentBox;
