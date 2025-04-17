import React from "react";
import Avatar from "./Avatar";

function AvatarComponent({name,email,image_url}) {
  return (
    <>
      <Avatar name={name} image_url={image_url} />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-600">{email}</p>
      </div>
    </>
  );
}

export default AvatarComponent;
