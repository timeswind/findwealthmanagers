import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as AuthActions from '../../redux/actions/auth';
import { Field, FieldArray, reduxForm, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import AutoComplete from 'material-ui/AutoComplete';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CategorySelector from '../../components/CategorySelector/CategorySelector';
import moment from 'moment';
import { push } from 'react-router-redux';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';

const validate = values => {
  const errors = {}
  const requiredFields = [ 'name', 'phone', 'brief', 'categories' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  return errors
}

class NewPublicAdvisorForm extends Component {
  constructor(props) {
    super(props);
    var selectCategories = []
    if (props.initialValues && props.initialValues.categories) {
      selectCategories = props.initialValues.categories
    }
    this.state = {
      addressPredictions: [],
      selectCategories: selectCategories,
      submitType: 'Create',
      list_pic_url: null,
      imageUploading: false
    };
    this.AddressAutoCompleteService = null
    this.geocoder = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues && nextProps.initialValues.categories) {
      this.setState({ selectCategories: nextProps.initialValues.categories, submitType: 'Update', listPicFile: null, list_pic_url: null });
    } else {
      this.setState({ selectCategories: [], submitType: 'Create', listPicFile: null, list_pic_url: null });
    }

    if (nextProps.initialValues && nextProps.initialValues.profileImage && nextProps.initialValues.profileImage.key) {
      this.updateListImage(nextProps.initialValues.profileImage.key, false)
    }
  }

  startImageUpload() {
    this.setState({imageUploading: true})
  }

  stopImageUpload() {
    this.setState({imageUploading: false})
  }

  updateListImage(key, refreshCache) {
    var profileImageParams = `x-oss-process=image/resize,w_150,limit_0/format,jpg`
    if (refreshCache) {
      profileImageParams =  + `${profileImageParams}&${new Date().getTime()}`
    }
    let url = `https://wealthie.oss-us-east-1.aliyuncs.com/${key}?${profileImageParams}`
    this.setState({ list_pic_url:  url, listPicFile: null })
  }

  onDrop (files) {
    const isEditList = this.props.initialValues && this.props.initialValues._id
    if (isEditList) {
      this.setState({
        listPicFile: files[0]
      })
    }
  }

  uploadListPicFile () {
    var self = this
    const isEditList = this.props.initialValues && this.props.initialValues._id
    if (isEditList) {
      var listPicFile = this.state.listPicFile
      if (listPicFile) {
        this.startImageUpload()
        axios.get('/api/internal/lists/upload-list-avatar-token?id=' + self.props.initialValues._id)
        .then(function(response){
          if (response.data.success && response.data.expires && response.data.AccessKeyId && response.data.signature) {
            var formData = new FormData();
            var key = response.data.key
            formData.append("OSSAccessKeyId", response.data.AccessKeyId);
            formData.append("policy", response.data.policy);
            formData.append("Signature", response.data.signature);
            formData.append("success_action_status", 201);
            formData.append("key", response.data.key);
            formData.append('file', listPicFile);
            // + listPicFile.name + '/?OSSAccessKeyId=' + response.data.AccessKeyId + "&Expires=" + response.data.expires + '&Signature=' + response.data.signature
            axios.post('https://wealthie.oss-us-east-1.aliyuncs.com', formData)
            .then((response)=>{
              if (response.status === 201) {
                self.updateListImageCallback(self.props.initialValues._id, key)
              } else {
                self.stopImageUpload()
                window.alert('fail to upload')
              }
            })

          } else {
            self.stopImageUpload()
            window.alert('fail to get token')
          }
        })
      }
    }
  }

  updateListImageCallback(list_id, key) {
    var self = this
    var data = {
      id: list_id,
      key: key
    }
    this.stopImageUpload()
    axios.post(`/api/internal/lists/profile-image-callback`, data)
    .then((response) => {
      if (response.status === 200 && response.data.success) {
        self.updateListImage(key, true)
      } else {
        window.alert('fail to upload')
      }
    })
  }

  selectAddress = (chosenAddress, index) => {
    var self = this

    self.props.dispatch(change('newPublicAdvisor', 'address', chosenAddress))
    this.geocoder.geocode( { 'address': chosenAddress}, function(results, status) {

      if (status === window.google.maps.GeocoderStatus.OK) {
        let longitude = results[0].geometry.location.lng()
        let latitude = results[0].geometry.location.lat()
        let loc = [longitude, latitude]
        self.props.dispatch(change('newPublicAdvisor', 'loc', loc))
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  handleAddressUpdateInput = (address) => {
    if (address) {
      let self = this
      window.clearTimeout(this.searchAddressDebounceTimeout)
      this.searchAddressDebounceTimeout = window.setTimeout(function () {
        self.searchAddress(address)
      }, 500);
    } else {
      window.clearTimeout(this.searchAddressDebounceTimeout)
    }
  };

  searchAddress = (address) => {
    let self = this
    this.AddressAutoCompleteService.getPlacePredictions({
      input: address,
      componentRestrictions: {country: 'us'}
    }, function (predictions) {
      var results = [];
      if (predictions) {
        predictions.forEach((prediction) => {
          results.push(prediction.description);
        })
      }
      self.setState({
        addressPredictions: results
      });
    });
  }

  initGoolePlaceAutocomplete() {
    this.AddressAutoCompleteService = new window.google.maps.places.AutocompleteService();
    this.geocoder = new window.google.maps.Geocoder();
  }

  onCategorySelect = (categories) => {
    const formattedCategories = categories.map((category) => {
      return category.code
    })
    if (this.props.initialValues) {
      this.props.initialValues.categories = formattedCategories
    }
    this.setState({selectCategories: formattedCategories})
    this.props.dispatch(change('newPublicAdvisor', 'categories', formattedCategories))
  }

  reset() {
    const { reset, dispatch, } = this.props
    reset()
    dispatch(change('newPublicAdvisor', 'address', ''))
    dispatch(change('newPublicAdvisor', 'loc', []))
    this.props.initialValues.categories = []
  }

  render() {
    const { submitType, list_pic_url, imageUploading, listPicFile } = this.state
    const { initialValues, handleSubmit, handleListDelete, dispatch } = this.props
    const isEditList = initialValues && initialValues._id
    const renderCategorySelector = ({ input, label, type, meta: { touched, error } }) => (
      <div>
        <CategorySelector onSelect={this.onCategorySelect} initialValues={this.state.selectCategories}></CategorySelector>
        {touched && ((error && <span style={{color: "rgb(244, 67, 54)", fontSize: 12}}>{error}</span>))}
      </div>
    )
    const renderExperience = ({ fields }) => (
      <div className="flex-column">
        <span className="field-title">
          Experience
        </span>
        {fields.map((experience, index) =>
          <div className="flex-column" key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
            <Field
              floatingLabelText="Title"
              hintText="Title"
              name={`${experience}.title`}
              type="text"
              component={TextField}
              fullWidth={true}
              label={`Title #${index + 1}`}/>
            <Field
              floatingLabelText="Content"
              hintText="Content"
              name={`${experience}.text`}
              type="text"
              component={TextField}
              multiLine={true}
              fullWidth={true}
              rows={3}
              label={`Text #${index + 1}`}/>
            <div className="flex-row justify-right">
              <FlatButton
                label="Remove"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#F44336"
                hoverColor="#E57373"
                style={{marginTop: "16px"}}
                onClick={() => fields.remove(index)}/>
            </div>
          </div>
        )}
        <div className="flex-row">
          <FlatButton
            label="Add experience"
            labelStyle={{color: "#FFF"}}
            rippleColor="#B2DFDB"
            backgroundColor="#546E7A"
            hoverColor="#37474F"
            style={{marginTop: "16px"}}
            onClick={() => fields.push()}/>
        </div>
      </div>
    )

    return (
      <div className="flex-column">
        {(initialValues && initialValues.listBy && initialValues.listBy.firstName) && (
          <div className="flex-column">
            <FlatButton
              label="Preview"
              labelStyle={{color: "#FFF"}}
              rippleColor="#B2DFDB"
              backgroundColor="#00BFA5"
              hoverColor="#26A69A"
              onTouchTap={()=>{
                dispatch(push(`/p/${initialValues._id}`))
              }}
              />
            <span style={{color: "#3F51B5", marginTop: 8}}>created by {this.props.initialValues.listBy.firstName}</span>
            <span style={{color: "#aaa", marginTop: 8}}>update: {moment(this.props.initialValues.updated_at).calendar()}</span>
          </div>
        )}
        { isEditList && (
          <div style={{margin: "16px 0"}}>
            {(listPicFile && listPicFile.preview) ? (
              <div className="flex-column flex-center" style={{width: 150, border: "1px dashed #aaa", padding: 16}}>
                <span style={{margin: "8px 0"}}>New Image Preview</span>
                <img src={listPicFile.preview} alt="preview" style={{width: 150, marginBottom: 16}}/>
                { imageUploading ? (
                  <CircularProgress />
                ) : (
                  <FlatButton
                    label="UPLOAD PIC"
                    labelStyle={{color: "#FFF"}}
                    rippleColor="#B2DFDB"
                    backgroundColor="#FFC107"
                    hoverColor="#F57C00"
                    onTouchTap={()=>{
                      this.uploadListPicFile()
                    }}
                    />
                ) }

              </div>
            ) :(
              <div>
                <Dropzone onDrop={(e) => {
                    this.onDrop(e)
                  }}>
                  <div style={{padding: 16, cursor: 'pointer'}}>Drop or add new image here</div>
                </Dropzone>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex-column">
          {(isEditList && list_pic_url) && (
            <div className="flex-column">
              <span style={{margin: "8px 0"}}>List image</span>
              <img src={list_pic_url} alt="List" style={{width: 150}}/>
            </div>
          )}
          <Field name="name" component={TextField} hintText="Name" floatingLabelText="Name"/>
          <Field name="phone" component={TextField} hintText="Phone" floatingLabelText="Phone"/>
          <Field name="email" component={TextField} hintText="Email for bussiness" floatingLabelText="Email for bussiness"/>
          <Field name="affiliation" component={TextField} hintText="Affiliation" floatingLabelText="Affiliation"/>
          <Field name="categories"component={renderCategorySelector}/>
          <Field
            name="brief"
            multiLine={true}
            fullWidth={true}
            rows={3}
            component={TextField}
            hintText="Brief"
            floatingLabelText="Brief"
            />
          <Field name="room" component={TextField} hintText="Room" floatingLabelText="Room"/>
          <AutoComplete
            hintText="Address"
            floatingLabelText="Address"
            openOnFocus={true}
            fullWidth={true}
            filter={(address)=> {
              return address
            }}
            searchText={initialValues.address || ""}
            dataSource={this.state.addressPredictions}
            onUpdateInput={this.handleAddressUpdateInput}
            onNewRequest={this.selectAddress}
            ref="Address"
            />
          <FieldArray name="experience" component={renderExperience}/>
          <div className="flex-row justify-right">
            {initialValues._id && (
              <FlatButton
                label="DELETE"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#F44336"
                hoverColor="#E57373"
                style={{marginTop: "16px", marginLeft: "16px"}}
                onTouchTap={()=>{
                  handleListDelete(initialValues._id)
                }}
                />
            )}
            {!isEditList && (
              <FlatButton
                label="RESET"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#FFC107"
                hoverColor="#F57C00"
                style={{marginTop: "16px", marginLeft: "16px"}}
                onTouchTap={()=>{
                  this.reset()
                }}
                />
            )}
            <FlatButton
              label={submitType}
              type="submit"
              labelStyle={{color: "#FFF"}}
              rippleColor="#B2DFDB"
              backgroundColor="#2196F3"
              hoverColor="#64B5F6"
              style={{marginTop: "16px", marginLeft: "16px"}}
              />
          </div>

        </form>
      </div>
    );
  }
}

// Decorate the form component
NewPublicAdvisorForm = reduxForm({
  form: 'newPublicAdvisor', // a unique name for this form
  validate
})(NewPublicAdvisorForm);

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(NewPublicAdvisorForm);
