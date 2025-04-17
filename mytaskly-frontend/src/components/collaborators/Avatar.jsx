const Avatar = ({ name, image_url }) => {
  if (image_url) {
    return <img src={image_url} alt={name} className="w-8 h-8 rounded-full" />;
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

export default Avatar;