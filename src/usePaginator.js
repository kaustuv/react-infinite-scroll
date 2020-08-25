import { useState, useEffect } from "react";

export default function usePaginator(
  dataLen,
  requestPageNumber,
  elementsPerPage
) {
  const [numElems, setNumElems] = useState([]);
  const [pageIdx, setPageIdx] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setNumElems(dataLen);
    setPageIdx([]);
    setHasMore(true);
  }, [dataLen, elementsPerPage]);

  useEffect(() => {
    const getPageIdx = (countIdx, requestPageNumber) => {
      var start = (requestPageNumber - 1) * elementsPerPage;
      const size =
        countIdx - requestPageNumber * elementsPerPage < 0
          ? countIdx - start
          : elementsPerPage;
      const idxRange =
        size > 0 ? [...Array(size).keys()].map((i) => i + start) : [];
      return idxRange;
    };
    var idx = getPageIdx(numElems, requestPageNumber);
    setPageIdx((prevIdx) => {
      const x = [...new Set([...prevIdx, ...idx])];
      console.log("all idx", x);
      setHasMore(x.length > 0);
      return x;
    });
  }, [numElems, requestPageNumber, elementsPerPage]);

  return { pageIdx, hasMore };
}
