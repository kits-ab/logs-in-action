import React, { useState, useRef, useEffect } from 'react';
import {
  LogViewerListContainer,
  LogLine,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import {
  calculateSize,
  maxLengthReducer
} from 'js/view/components/helpers/measureHelper';
import {
  createRegexReducer,
  createHeightReducer,
  scrollToBottom
} from 'js/view/components/helpers/logHelper';
import _ from 'lodash';
import TextHighlightRegex from './TextHighlightRegex';
import WindowedList from 'react-list';

/** Custom hook for a reduced value cache that only
 * reduces further values if the list supplied to
 * reduce is longer than the previous length */
const useCache = v => {
  const [length, setLength] = useState(0);
  const [value, setValue] = useState(v);

  const reduce = (reducer, list) => {
    if (list.length <= length) return;
    const items = list.slice(length);
    setValue(items.reduce(reducer, value));
    setLength(list.length);
  };

  const reset = v => {
    setValue(v);
    setLength(0);
  };

  return [value, reduce, reset];
};

const LogViewerList = props => {
  const logRef = useRef();
  const listRef = useRef();
  const rulerRef = useRef();

  const [charSize, setCharSize] = useState([0, 0]);
  const [clientWidth, setClientWidth] = useState(1);
  const [lines, linesReduce, linesReset] = useCache([]);
  const [heights, heightsReduce, heightsReset] = useCache({});
  const [maxLength, maxLengthReduce, maxLengthReset] = useCache(0);

  const updateCaches = () => {
    linesReduce(createRegexReducer(props.filterRegExp), props.lines);
    heightsReduce(createHeightReducer(charSize, clientWidth), lines);
    maxLengthReduce(maxLengthReducer, lines);
  };

  const resetSizes = () => {
    if (!logRef.current || !rulerRef.current) return;

    setClientWidth(logRef.current.clientWidth);
    setCharSize(calculateSize('W', rulerRef.current));
  };

  const resetCaches = (reset = {}) => {
    if (!reset.lines !== false) linesReset([]);
    if (!reset.heights !== false) heightsReset({});
    if (!reset.maxLength !== false) maxLengthReset(0);
  };

  const reset = ignore => {
    resetSizes();
    resetCaches(ignore);
  };

  useEffect(() => {
    resetSizes();
  }, []);

  useEffect(() => {
    const onResize = _.debounce(() => {
      reset({ lines: false });
    }, 222);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    reset();
  }, [props.filterRegExp]);

  useEffect(() => {
    updateCaches();
  });

  useEffect(() => {
    if (props.scrollToBottom && listRef.current)
      scrollToBottom(listRef.current, lines);
  });

  const width = props.wrapLines ? clientWidth : maxLength * charSize[1];

  const heightGetter = index => {
    return index >= 0 && props.wrapLines
      ? heights[lines[index].length]
      : charSize[0];
  };

  return (
    <LogViewerListContainer ref={logRef}>
      <LogLineRuler ref={rulerRef} />
      <WindowedList
        ref={listRef}
        itemRenderer={(i, key) => {
          const line = lines[i];
          return (
            <LogLine
              key={key}
              index={i}
              minSize={0}
              fixedWidth={width}
              fixedHeight={heightGetter(i)}
              wrap={props.wrapLines ? 'true' : undefined}
            >
              {props.highlightRegExp && props.highlightRegExp.test(line) ? (
                <TextHighlightRegex
                  text={line}
                  color={props.highlightColor}
                  regex={props.highlightRegExp}
                />
              ) : (
                line
              )}
            </LogLine>
          );
        }}
        itemSizeGetter={heightGetter}
        length={lines.length}
        type="variable"
      />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
