import React from "react";
import { HiOutlinePhotograph } from "react-icons/hi";

const UploadPic = ({ onChange, text, name, width }) => {
	return (
		<div
			className={`btn tracking-wide ${
				width ? "" : "w-1/2"
			} mx-auto h-auto p-2 border text-gray-500`}
		>
			<label
				className="flex cursor-pointer items-center
    justify-between"
			>
				<span className="">{text}</span>
				<input
					type="file"
					className="hidden"
					name={name}
					accept="image/x-png,image/gif,image/jpeg"
					onChange={onChange}
				/>
				<HiOutlinePhotograph size={"1.5rem"} />
			</label>
		</div>
	);
};

export default UploadPic;
