import {useEffect, useState} from 'react';

const getWindowDimensions = () => {
	const value = typeof window !== 'undefined';
	return {
		width: value ? window.innerWidth : 0,
		height: value ? window.innerHeight : 0,
	};
};

function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			window &&
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}

export default useWindowDimensions;
