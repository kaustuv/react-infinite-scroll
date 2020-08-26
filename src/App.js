import React, { useState, useRef, useCallback } from "react";
import { elemsData } from "./data";
import * as _ from "lodash";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <PaginatedList
        data={_.pick(elemsData, [...Array(200).keys()])}
        listSize={20}
      />
    </div>
  );
}

function PaginatedList({ data, listSize }) {
  const [currIdx, setCurrIdx] = useState(0);
  const [firstIdx, setFirstIdx] = useState(0);
  const [topSentPrevY, setTopSentPrevY] = useState(0);
  const [topSentPrevRatio, setTopSentPrevRatio] = useState(0);
  const [botSentPrevY, setBotSentPrevY] = useState(0);
  const [botSentPrevRatio, setBotSentPrevRatio] = useState(0);

  const getNumFromStyle = (numStr) =>
    Number(numStr.substring(0, numStr.length - 2));

  const recycleDOM = () => {
    for (let i = 0; i < listSize; i++) {
      const tile = document.getElementById("ele-tile-" + i);
      console.log(i + firstIdx);
      tile.firstElementChild.innerText = `${i + firstIdx}.${
        elemsData[i + firstIdx].name
      }`;
    }
  };

  const getSlidingWindow = (isScrollDown) => {
    const increment = listSize / 2;
    if (isScrollDown) {
      setFirstIdx(currIdx + increment);
    } else {
      setFirstIdx(currIdx - increment - listSize);
    }
    if (firstIdx < 0) {
      setFirstIdx(0);
    }
  };

  const adjustPaddings = (isScrollDown) => {
    const container = document.getElementById("ele-list");
    const currPaddingTop = getNumFromStyle(container.style.paddingTop);
    const currPaddingBot = getNumFromStyle(container.style.paddingBottom);
    const remPaddingsVal = 170 * (listSize / 2);

    if (isScrollDown) {
      container.style.paddingTop = currPaddingTop + remPaddingsVal + "px";
      container.style.paddingBottom =
        currPaddingBot === 0 ? "0px" : currPaddingBot - remPaddingsVal + "px";
    } else {
      container.style.paddingBottom = currPaddingBot + remPaddingsVal + "px";
      container.style.paddingTop =
        currPaddingTop === 0 ? "0px" : currPaddingTop - remPaddingsVal + "px";
    }
  };

  const botSentCallback = (node) => {
    // console.log(node.target);
    if (currIdx === _.keys(data).length - listSize) {
      // reached bottom
      return;
    }
    const currentY = node.boundingClientRect.top;
    const currentRatio = node.intersectionRatio;
    const isIntersecting = node.isIntersecting;

    // conditional check for scrolling down
    if (
      currentY < botSentPrevY &&
      currentRatio > botSentPrevRatio &&
      isIntersecting
    ) {
      getSlidingWindow(true);
      adjustPaddings(true);
      recycleDOM();
      setCurrIdx(firstIdx);
    }

    setBotSentPrevY(currentY);
    setBotSentPrevRatio(currentRatio);
  };

  const topSentCallback = (node) => {
    if (currIdx === 0) {
      const container = document.getElementById("ele-list");
      container.style.paddingTop = "0px";
      container.style.paddingBottom = "0px";
    }

    const currentY = node.boundingClientRect.top;
    const currentRatio = node.intersectionRatio;
    const isIntersecting = node.isIntersecting;

    // conditional check for scrolling down
    if (
      currentY > topSentPrevY &&
      currentRatio >= topSentPrevRatio &&
      isIntersecting &&
      currIdx
    ) {
      getSlidingWindow(false);
      adjustPaddings(false);
      recycleDOM();
      setCurrIdx(firstIdx);
    }

    setTopSentPrevY(currentY);
    setTopSentPrevRatio(currentRatio);
  };

  const observer = useRef();
  const sentCallbacks = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "ele-tile-0") {
            topSentCallback(entry);
          } else if (entry.target.id === `ele-tile-${listSize - 1}`) {
            botSentCallback(entry);
          }
        });
      },
      {
        // root: document.querySelector("#scrollArea"),
        rootMargin: "30px",
        threshold: 1.0
      }
    );
    observer.current.observe(document.getElementById("ele-tile-0"));
    observer.current.observe(
      document.getElementById(`ele-tile-${listSize - 1}`)
    );
  };

  return (
    <div id="container">
      <ul id="ele-list" style={{ topPadding: "0px", bottomPadding: "0px" }}>
        {[...Array(listSize).keys()].map((idx, index) => {
          if (index === listSize - 1 || index === 0) {
            return (
              <li
                ref={sentCallbacks}
                className="ele-tile"
                id={"ele-tile-" + index}
                key={"ele-tile-" + index}
              >
                <h4>{">>> " + index + "." + elemsData[index].name}</h4>
              </li>
            );
          } else {
            return (
              <li
                className="ele-tile"
                id={"ele-tile-" + index}
                key={"ele-tile-" + index}
              >
                <h4>{index + "." + elemsData[index].name}</h4>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
