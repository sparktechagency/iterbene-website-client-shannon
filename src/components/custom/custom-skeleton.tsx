const Skeleton = ({ width = "100%", height = "1rem", className = "" }) => {
  return (
    <div
      style={{ width, height }}
      className={`skeleton-loader ${className}`}
    ></div>
  );
};

export default Skeleton;
