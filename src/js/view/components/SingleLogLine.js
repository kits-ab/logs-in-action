import React from 'react';
import { LogLine } from '../styledComponents/LogViewerListStyledComponents';
import TextHighlightRegex from './TextHighlightRegex';

/**
 * Pure component that is actually memoed to render a single line!
 * When the props are the same as an earlier call,
 * the function will not be called and the earlier result will be used.
 */
const MemoedSingleLogLine = React.memo(props => {
  return (
    <LogLine
      style={{
        ...props.style,
        width: props.elementWidth + 'px'
      }}
      wrap={props.shouldWrap ? 'true' : undefined}
      index={props.index}
    >
      {props.line.highlightLine ? (
        <TextHighlightRegex line={props.line} color={props.highlightColor} />
      ) : (
        <span>{props.line.sections[0].text}</span>
      )}
    </LogLine>
  );
});

/**
 * Component to translate the entire data.lines array to just a single line,
 * so memoization can be used on the component for the single line.
 * Memoization probably doesn't do much for this, as data.lines is constantly changing.
 */
const SingleLogLineTranslator = React.memo(({ data, index, style }) => {
  let line = data.lines[index];
  return (
    <MemoedSingleLogLine
      style={style}
      line={line}
      highlightColor={data.highlightColor}
      elementWidth={data.elementWidth}
      shouldWrap={data.shouldWrap}
      index={index}
    ></MemoedSingleLogLine>
  );
});

export default SingleLogLineTranslator;
