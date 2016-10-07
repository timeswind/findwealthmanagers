import React, { Component } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';
import { SelectField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { TimeToIndex } from '../../core/TimeToIndex';

const validate = values => {
  const errors = {}
  const requiredFields = [ 'day', 'from', 'to' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  return errors
}

class AddAvailableTimeForm extends Component {
  handleChangeStartTimePicker = (event, date) => {
    let timeInNumber = TimeToIndex(date)
    this.props.dispatch(change('addAvailableTime', 'from', timeInNumber))
  };

  handleChangeEndTimePicker = (event, date) => {
    let timeInNumber = TimeToIndex(date)
    this.props.dispatch(change('addAvailableTime', 'to', timeInNumber))
  };

  render() {
    const { handleSubmit, weekdays } = this.props;
    return (
      <form onSubmit={handleSubmit} className="flex-column">

        <div className="flex-column">
          <Field
            name="day"
            component={SelectField}
            hintText="Day"
            floatingLabelText="Day">
            {
              weekdays.map((name, index)=>{
                return (
                  <MenuItem key={index} value={index + 1} primaryText={name}/>
                )
              })
            }
          </Field>
          <TimePicker
            format="ampm"
            hintText="Pick Start Time"
            onChange={this.handleChangeStartTimePicker}
            />
          <TimePicker
            format="ampm"
            hintText="Pick End Time"
            onChange={this.handleChangeEndTimePicker}
            />
          <div className="flex-row flex-end">
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={()=>{
                this.props.handleCancle()
              }}
              />
            <FlatButton
              type="submit"
              label="ADD"
              primary={true}
              />
          </div>
        </div>

      </form>
    );
  }
}

// Decorate the form component
AddAvailableTimeForm = reduxForm({
  form: 'addAvailableTime', // a unique name for this form
  validate
})(AddAvailableTimeForm);

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(AddAvailableTimeForm);
