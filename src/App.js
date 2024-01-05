import React, { useState, useEffect } from "react";
import "./App.css";
import JSZip from "jszip";

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setHeaderVisible((prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 100) || prevScrollPos - currentScrollPos > 0);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, headerVisible]);

  const extractZip = async (file) => {
    const zip = new JSZip();
    const extractedFiles = await zip.loadAsync(file);
    const imageArray = [];

    for (const [, file] of Object.entries(extractedFiles.files)) {
      const content = await file.async("base64");
      imageArray.push("data:image/jpeg;base64," + content);
    }

    setImages(imageArray);
    setIsLoading(false);
  };

  return (
    <>
      <header className={`${headerVisible ? "translate-y-0" : "-translate-y-full"} transition-all w-full h-10 md:h-12 fixed flex justify-center top-0 bg-[#010409] items-center`}>
        <label className="border-[#30363d] text-white border-[1px] rounded px-2" htmlFor="upload-tome">
          Browse...
        </label>
        <input
          id="upload-tome"
          className="w-24 h-8 flex justify-center items-center opacity-0 absolute -z-1"
          type="file"
          name="tome"
          onChange={(e) => extractZip(e.target.files[0])}
        />
      </header>

      <div className="w-full h-screen pt-8 text-center text-white">
        {isLoading ? <p className="pt-8">Loading...</p> : images.map((url, index) => <img key={index} className="mr-auto ml-auto" src={url} alt={index} />)}
      </div>
    </>
  );
}

export default App;
