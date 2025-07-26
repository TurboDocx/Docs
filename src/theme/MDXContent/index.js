import React from "react";
import MDXContent from "@theme-original/MDXContent";

import TracingBeam from "@site/src/components/tracing-beam";
import svgToDataUri from "mini-svg-data-uri";
import { BackgroundGradientAnimation } from "@site/src/components/background-gradient-animation";
import { useHistory } from "@docusaurus/router";

export default function MDXContentWrapper(props) {
  let image = `url("${svgToDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="white" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
  )}")`;

  const handleClick = () => {
    // Navigate to a different path when the button is clicked
    history.push("/docs/another-page");
  };

  const metadata = props?.children?.type?.metadata ?? {};
  const frontMatter = props?.children?.type?.frontMatter ?? {};
  const authors = Array.isArray(metadata.authors) ? metadata.authors : [];

  return (
    <>
      {metadata?.readingTime ? (
        <>
          <BackgroundGradientAnimation
            lightImage={frontMatter?.light_image}
            imagePositionY={
              frontMatter?.image_position_y
            }
            bgImageSize={frontMatter?.image_size}
            imagePositionX={
              frontMatter?.image_position_x
            }
            headerHeight={frontMatter?.header_height}
            image={frontMatter?.header_image}
            backgroundRepeat={frontMatter?.image_repeat}
            className="test"
            style={{
              marginBottom: "2em",
              backgroundImage: frontMatter?.header_image,
            }}
            onClick={handleClick}
          >
            <h1 style={{ paddingLeft: "1vw", fontSize: "30px" }}>
              <a href={metadata.permalink}>
                {metadata.title}
              </a>
            </h1>
            <h3
              style={{ paddingLeft: "1vw", fontSize: "16px", fontWeight: 400 }}
            >
              {authors.length > 0 &&
                authors.map((item, index) => (
                  <span key={index}>{" " + item.name + ","}</span>
                ))}
              &nbsp; On {metadata.formattedDate},{" "}
              {Math.ceil(metadata.readingTime * 10) / 1} min
            </h3>
            <div className="flex flex-row items-center mb-10 w-full">
              {authors.map((item, index) => (
                <div className="pl-2">
                  <img
                    className="author-avatar"
                    style={{ height: "4vh" }}
                    src={item.imageURL || "/img/TurboDocxLogo.png"}
                  ></img>
                </div>
              ))}
              <div className="pl-6">
                {authors.length > 0 &&
                  authors.map((item, index) => (
                    <span key={index}>{" " + item.name + ","}</span>
                  ))}
              </div>
            </div>
          </BackgroundGradientAnimation>
          <MDXContent style={{ backgroundImage: image }} {...props} />
        </>
      ) : props?.children?.props?.children?.props?.className?.includes("theme-api-markdown") ? (
        // Render something for the new condition
        <div style={{ paddingTop: "2em" }}>
          <MDXContent style={{ backgroundImage: image }} {...props} />
        </div>
      ) : (
        <TracingBeam>
          <div style={{ paddingTop: "2em" }}>
            <MDXContent style={{ backgroundImage: image }} {...props} />
          </div>
        </TracingBeam>
      )}
    </>
  );
}