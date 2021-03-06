import React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

class Dropdown extends React.Component {
  render() {
    const { value, children, id = "default", floatingLabel, onChange, style, disabled } = this.props;
    return (
      <form autoComplete="off">
        <FormControl disabled={disabled} style={style} data-test={`dropdown-${id}`}>
          <InputLabel htmlFor={id}>{floatingLabel}</InputLabel>
          <Select
            value={value}
            onChange={v => onChange(v.target.value)}
            inputProps={{
              name: id,
              id
            }}
            SelectDisplayProps={{ "data-test": `dropdown-${id}-click` }}
          >
            {children}
          </Select>
        </FormControl>
      </form>
    );
  }
}

export default Dropdown;
