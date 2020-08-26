import { useState, useEffect } from "react";
import * as _ from "lodash";

function scrollPosition() {
  const [y, setY] = useState(0);
  window.onscroll = function () {
    var doc = document.body,
      scrollPosition = doc.scrollTop,
      pageSize = doc.scrollHeight - doc.clientHeight,
      percentageScrolled = Math.floor((scrollPosition / pageSize) * 100);

    if (percentageScrolled >= 50) {
      // if the percentage is >= 50, scroll to top
      window.scrollTo(0, 0);
    }
  };
}

export default function usePaginator(
  dataLen,
  requestPagePrepend,
  requestPageAppend,
  elementsPerPage
) {
  console.log(
    "[usePaginator] dataLen:",
    dataLen,
    "reqPgAppend:",
    requestPageAppend,
    "reqPgPrepend:",
    requestPagePrepend,
    "elemPerPg:",
    elementsPerPage
  );

  const [numElems, setNumElems] = useState(0);
  const [pageIdx, setPageIdx] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreAbove, setHasMoreAbove] = useState(false);

  useEffect(() => {
    setNumElems(dataLen);
    setPageIdx([]);
    setHasMore(true);
    setHasMoreAbove(false);
  }, [dataLen, elementsPerPage]);

  useEffect(() => {
    console.log(
      "[usePaginator][requestPageAppend] pg->",
      requestPageAppend,
      "numElems:",
      numElems
    );
    const getPageIdx = (totalCount, requestPageAppend) => {
      console.log("[usePaginator][append] reqPgAppend:", requestPageAppend);
      var start = (requestPageAppend - 1) * elementsPerPage;
      const size =
        totalCount - requestPageAppend * elementsPerPage < 0
          ? totalCount - start
          : elementsPerPage;
      const idxRange =
        size > 0 ? [...Array(size).keys()].map((i) => i + start) : [];
      return idxRange;
    };
    var idx = getPageIdx(numElems, requestPageAppend);
    setPageIdx((prevIdx) => {
      var scrollPosition = window.scrollTop;
      console.log("scrollTop", scrollPosition);
      console.log("[usePaginator][append] old idx", prevIdx);
      console.log("[usePaginator][append] new idx", idx);
      const x = _.takeRight([...prevIdx, ...idx], elementsPerPage * 2);
      // const x = [...prevIdx, ...idx];
      console.log("[usePaginator][append] all idx", x);
      console.log(
        "[usePaginator][append] [hasmore][",
        x[x.length - 1],
        "<",
        numElems - 1,
        "]",
        x[x.length - 1] < numElems - 1
      );
      setHasMore(x[x.length - 1] < numElems - 1);
      return x;
    });
  }, [numElems, requestPageAppend, elementsPerPage]);

  useEffect(() => {
    console.log(
      "[usePaginator][requestPagePrepend] pg->",
      requestPagePrepend,
      "numElems:",
      numElems
    );
    const getPageIdx = (countIdx, requestPagePrepend) => {
      var start = (requestPagePrepend - 1) * elementsPerPage;
      const size =
        countIdx - requestPagePrepend * elementsPerPage < 0
          ? countIdx - start
          : elementsPerPage;
      const idxRange =
        size > 0 ? [...Array(size).keys()].map((i) => i + start) : [];
      return idxRange;
    };
    var idx = getPageIdx(numElems, requestPagePrepend);
    setPageIdx((prevIdx) => {
      const x = _.take([...idx, ...prevIdx], elementsPerPage);
      console.log("[usePaginator][prepend] all idx", x);
      console.log(
        "[usePaginator][prepend] [hasMoreAbove][",
        requestPagePrepend,
        "!==",
        1,
        "]",
        requestPagePrepend !== 1
      );
      setHasMoreAbove(requestPagePrepend !== 1);
      return x;
    });
  }, [numElems, requestPagePrepend, elementsPerPage]);

  return { pageIdx, hasMore, hasMoreAbove };
}
