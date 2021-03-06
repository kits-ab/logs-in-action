import React from 'react';
import { TextField } from 'office-ui-fabric-react';
import { connect } from 'react-redux';
import _ from 'lodash';

class TextFieldInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: this.props.value,
      value: this.props.value
    };
  }

  debounceOnChange = _.debounce(text => {
    this.props.onTextChange && this.props.onTextChange(text);
  }, this.props.debounce);

  handleOnChange = event => {
    this.setState({ input: event.target.value });
    this.debounceOnChange(event.target.value);
  };

  componentDidUpdate() {
    if (this.state.value !== this.props.value) {
      this.setState({
        input: this.props.value,
        value: this.props.value
      });
    }
  }

  render() {
    return (
      <TextField
        disabled={this.props.disabled}
        underlined
        label={this.props.label}
        placeholder={this.props.placeholder}
        value={this.state.input}
        onChange={event => {
          this.handleOnChange(event);
        }}
        type="text"
      />
    );
  }
}

export default connect()(TextFieldInput);
