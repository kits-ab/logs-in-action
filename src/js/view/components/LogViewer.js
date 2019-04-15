import React from 'react';
import { findMatches } from './lineFilterHelper';
import * as LogViewerSC from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      autoScroll: true
    };

    this.liveLinesContainer = React.createRef();
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.lines.split('\n'));
    const matchArray = findMatches(this.props.filterInput, lineArray);

    return matchArray;
  };

  componentDidUpdate = () => {
    if (this.state.autoScroll !== this.props.tailSwitch) {
      this.handleAutoScroll();
    }
  };

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);
  };

  handleAutoScroll = () => {
    !this.state.autoScroll &&
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    this.setState({
      autoScroll: !this.state.autoScroll
    });
  };

  scrollToBottom = () => {
    if (this.state.autoScroll) {
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    }
  };

  setHighlightColor = line => {
    return line.match(new RegExp(this.props.highlightInput, 'gi')) &&
      this.props.highlightInput
      ? { background: this.props.highlightColorInput }
      : {};
  };
  render() {
    const lines = this.props.lines && this.createLineArray();
    return (
      <LogViewerSC.TextContainer ref={this.liveLinesContainer}>
        {lines &&
          lines.map((line, i) => {
            return (
              <p style={this.setHighlightColor(line)} key={i}>
                {line}
              </p>
            );
          })}
      </LogViewerSC.TextContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    tailSwitch: state.topPanelReducer.tailSwitch,
    filterInput: state.topPanelReducer.filterInput,
    highlightInput: state.topPanelReducer.highlightInput
  };
};

export default connect(mapStateToProps)(LogViewer);
