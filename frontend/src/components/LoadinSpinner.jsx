const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;
  
	return <span className={`loading text-white loading-spinner ${sizeClass}`} />;
  };
  
  export default LoadingSpinner;
  