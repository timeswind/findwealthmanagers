import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { TextField, DatePicker, Checkbox } from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const renderFields = ({ fields }) =>
<div className="flex-column" style={{display: 'inline-block'}}>
  {fields.map((field, index) =>
    <div className="flex-column" key={index} style={{margin: "0 0 16px 0", border: "1px solid #ddd", padding: "0 16px 16px 16px", display: 'inline-block'}}>
      <div className="flex-row flex-baseline">
        <Field
          floatingLabelText="Field Name"
          hintText="Field Name"
          name={`${field}.key`}
          type="text"
          component={TextField}
          style={{marginRight: 16}}
          />
        <Field
          floatingLabelText="Value"
          hintText="Value"
          name={`${field}.value`}
          type="text"
          component={TextField}
          style={{marginRight: 16}}
          />
        <FlatButton
          icon={<FontIcon className="material-icons" style={{color: "#fff"}}>clear</FontIcon>}
          labelStyle={{color: "#FFF"}}
          rippleColor="#B2DFDB"
          backgroundColor="#F44336"
          hoverColor="#E57373"
          onTouchTap={() => fields.remove(index)}
          style={{bottom: 4}}/>
      </div>
    </div>
  )}
  <div className="flex-row">
    <FlatButton
      label="Add Field"
      labelStyle={{color: "#FFF"}}
      rippleColor="#B2DFDB"
      backgroundColor="#546E7A"
      hoverColor="#37474F"
      onTouchTap={() => fields.push()}
      icon={<FontIcon className="material-icons" style={{color: "#fff"}}>add</FontIcon>}/>
  </div>
</div>


class AgentDetailView extends Component {
  componentWillMount() {
    console.log('mount')
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.initialValues.name)
    if (nextProps.initialValues._id !== this.props.initialValues._id) {
      console.log('force update')
      // if (nextProps.initialValues.joinAt) {
      //   nextProps.initialValues.joinAt = new Date(nextProps.initialValues.joinAt)
      // }
      this.props.initialize(nextProps.initialValues)
    }
  }

  render() {
    const { style, dirty, reset, handleSubmit } = this.props
    // const { agents, selectAgent } = this.props.agentbook

    return (
      <form className="flex-column" style={style} onSubmit={handleSubmit}>
        { dirty && (
          <div className="flex-row">
            <FlatButton
              label="Update Agent"
              backgroundColor="rgb(48, 73, 102)"
              hoverColor="rgba(48, 73, 102, 0.8)"
              style={{color: '#fff'}}
              type="submit"
              />
            <FlatButton
              label="Cancel"
              style={{color: 'rgb(48, 73, 102)'}}
              onTouchTap={()=>{
                reset()
              }}
              />
          </div>
        ) }
        <Field
          name="name"
          component={TextField}
          hintText="Agent Name"
          floatingLabelText="Agent Name"
          />
        <Field
          name="email"
          component={TextField}
          hintText="Email"
          floatingLabelText="Email"
          />
        <Field
          name="phone"
          component={TextField}
          hintText="Phone Number"
          floatingLabelText="Phone Number"
          />
        <Field name="joinAt"
          component={DatePicker}
          format={(value, name) => {
            console.log(value)
            return (value === '' || typeof value === "undefined") ? null : new Date(value)
          }}
          hintText="Join At"
          floatingLabelText="Join At"
          style={{marginBottom: 16}}
          />
        <Field name="isActive"
          component={Checkbox}
          label="Active"
          style={{marginBottom: 24}}/>
        <FieldArray name="fields" component={renderFields}/>
      </form>
    )
  }
}

AgentDetailView = reduxForm({
  form: 'agentEditForm',
  enableReinitialize: true
})(AgentDetailView);

export default AgentDetailView;
