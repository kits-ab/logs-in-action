/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import memoize from 'memoize-one';
import {
  LogViewerListContainer,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import SingleLogLineTranslator from './SingleLogLine';

import _ from 'lodash';

const createItemData = memoize(
  (lines, highlightColor, elementWidth, shouldWrap) => {
    return {
      lines,
      highlightColor,
      elementWidth,
      shouldWrap
    };
  }
);

const LogViewerList = props => {
  const variableSizeListRef = useRef(); // Reference to the React List component. Used for calling the lists functions to reset the cache of sizes
  const variableSizeListOuterRef = useRef(); // Reference to the actual DOM element. Used for manually scrolling to the bottom

  const [logLineElementWidth, setLogLineElementWidth] = useState(1); // Used to save and set the width the LogLine elements should be
  const [maxLineLength, setCurrentMaxLineLength] = useState(1); // Used to save and update how many characters the longest line has
  const [lastLineCount, setLastLineCount] = useState(0); // Used to keep track of how many lines there were last render, for optimizing mainly calculation of new lines

  const logViewerListContainerRef = useRef();
  const [listDimensions, setListDimensions] = useState({
    width: 575,
    height: 145
  });

  const oneCharacterSizeRef = useRef();
  const [characterDimensions, setCharacterDimensions] = useState({
    width: 10,
    height: 19
  });

  // Itemdata used to send needed props and state from this component to the pure component that renders a single line
  const itemData = createItemData(
    props.lines,
    props.highlightColor,
    logLineElementWidth,
    props.wrapLines
  );

  useEffect(() => {
    // Handler to update the dimensions when needed
    const handleResize = () => {
      setListDimensions({
        width: logViewerListContainerRef.current.offsetWidth,
        height: logViewerListContainerRef.current.offsetHeight
      });

      setCharacterDimensions({
        width: oneCharacterSizeRef.current.offsetWidth,
        height: oneCharacterSizeRef.current.offsetHeight
      });
    };
    handleResize();

    // Calls are throttled to once every 200 ms
    const debouncedResizeHandler = _.debounce(handleResize, 200);

    window.addEventListener('resize', debouncedResizeHandler);

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  useEffect(() => {
    // Update the width to use for the list to fit the longest line if wraplines isn't set
    setLogLineElementWidth(
      props.wrapLines
        ? listDimensions.width
        : maxLineLength * characterDimensions.width
    );
    // Clear the list's cache of all item sizes
    variableSizeListRef.current &&
      variableSizeListRef.current.resetAfterIndex(0);
  }, [
    props.wrapLines,
    maxLineLength,
    listDimensions.width,
    characterDimensions.width
  ]);

  useEffect(() => {
    let currentMaxLength = maxLineLength;
    let index = lastLineCount;
    for (; index < props.lines.length; index++) {
      // Remove all of the stuff hiddenWindow has added to it, as they shouldn't count towards the length of the string
      let lineWithoutExtrasLength = props.lines[index].replace(
        /\[\/?HL[LG\d]+\]/g,
        ''
      ).length;
      if (lineWithoutExtrasLength > currentMaxLength) {
        currentMaxLength = lineWithoutExtrasLength;
      }
    }

    setCurrentMaxLineLength(currentMaxLength);
    setLastLineCount(index);

    if (props.scrollToBottom) {
      variableSizeListOuterRef.current.scrollTop =
        variableSizeListOuterRef.current.scrollHeight;
    }
  }, [props.lines]);

  /**
   * Returns the row height needed for an item at position index,
   * based on if it should wrap lines and how many characters fit in the window
   * @function
   * @param {Number} index - the index of the item
   * @returns The rowheight to use, in pixels.
   */
  const getItemSizeAtPosition = index => {
    if (props.wrapLines) {
      // Replace all of the stuff hiddenWindow has added to it, as they shouldn't count towards the length of the string
      let lineWithoutExtrasLength = props.lines[index].replace(
        /\[\/?HL[LG\d]*\]/g,
        ''
      ).length;
      return (
        Math.round(
          (lineWithoutExtrasLength * characterDimensions.width) /
            logLineElementWidth
        ) * characterDimensions.height
      );
    } else {
      return characterDimensions.height;
    }
  };

  return (
    <LogViewerListContainer ref={logViewerListContainerRef}>
      <LogLineRuler ref={oneCharacterSizeRef}>
        <span>A</span>
      </LogLineRuler>
      <VariableSizeList
        style={{ willChange: 'unset' }}
        ref={variableSizeListRef}
        outerRef={variableSizeListOuterRef}
        width={listDimensions.width}
        height={listDimensions.height}
        itemCount={props.lines.length}
        itemSize={getItemSizeAtPosition}
        itemData={itemData}
      >
        {SingleLogLineTranslator}
      </VariableSizeList>
    </LogViewerListContainer>
  );
};

export default LogViewerList;
