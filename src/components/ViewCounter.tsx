'use client';

import { useEffect, useState } from "react";

const ViewCounter = ({ postId }: { postId: number }) => {
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    const key = `views-${postId}`;
    const storedViews = localStorage.getItem(key);
    if (storedViews) {
      setViews(Number(storedViews));
    } else {
      const randomViews = Math.floor(Math.random() * 200 + 1);
      localStorage.setItem(key, String(randomViews));
      setViews(randomViews);
    }
  }, [postId]);

  return <span>{views} views</span>;
};

export default ViewCounter;
