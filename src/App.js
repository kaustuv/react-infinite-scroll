import React, { Fragment, useState, useRef, useCallback } from "react";
import { elemsData } from "./data";
import usePaginator from "./usePaginator";
import * as _ from "lodash";

export default function App() {
  return (
    <div className="App">
      <PaginatedList
        data={_.pick(elemsData, [...Array(100).keys()])}
        elementsPerPage={30}
      />
    </div>
  );
}

function PaginatedList({ data, elementsPerPage }) {
  const [pageNumber, setPageNumber] = useState(1);
  const { pageIdx, hasMore } = usePaginator(
    data.length,
    pageNumber,
    elementsPerPage
  );

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        },
        {
          root: document.querySelector("#scrollArea"),
          rootMargin: "0px",
          threshold: 1.0
        }
      );
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const handleChange = (event) => {
    setPageNumber(event.target.value);
  };

  return (
    <Fragment>
      <input type="text" value={pageNumber} onChange={handleChange}></input>
      {pageIdx.map((idx, index) => {
        if (index === pageIdx.length - 1) {
          return (
            <div key={index} ref={lastElementRef}>
              {">>> " + elemsData[idx].name}
            </div>
          );
        } else {
          return <div key={index}>{elemsData[idx].name}</div>;
        }
      })}
      <div>{pageNumber}</div>
    </Fragment>
  );
}
