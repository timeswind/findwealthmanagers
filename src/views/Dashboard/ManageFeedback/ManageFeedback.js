import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {Tabs, Tab} from 'material-ui/Tabs';
import { ListItem } from 'material-ui/List';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import NewFeedbackForm from '../../../forms/NewFeedbackForm/NewFeedbackForm';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './ManageFeedback.css'


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class ManageFeedbackView extends Component {
  state = {
    createForm: false,
    templateIndex: null,
    templates: [],
    feedbacks: [],
    rightPanelTab: 'questions',
    responsesDisplay: 'summery'
  }

  componentWillMount() {
    this.getTemplates()
  }

  showCreateForm() {
    this.setState({createForm: true})
  }

  showTemplate(template_index) {
    this.setState({
      createForm: false,
      templateIndex: template_index
    })
  }

  getTemplates() {
    var self = this
    axios.get('/api/protect/feedback/templates')
    .then(function(response) {
      var json = response.data
      if (json.success && json.templates && json.templates.length !== 0) {
        self.setState({
          createForm: false,
          templateIndex: 0,
          templates: json.templates
        })
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleFeecbackTemplateFormSubmit = (form) => {
    var self = this
    axios.post('/api/protect/feedback/template', form)
    .then(function(response) {
      if (response.data.success) {
        self.getTemplates()
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleRightPanelTabChange = (value) => {
    if (value === "responses") {
      this.getResponses(this.state.templates[this.state.templateIndex]._id)
    }
    this.setState({
      rightPanelTab: value,
    });
  };

  getResponses(template_id) {
    var self = this
    self.setState({feedbacks: []})
    axios.get('/api/protect/feedbacks/' + template_id)
    .then(function(response) {
      var json = response.data
      if (response.data.success) {
        self.setState({feedbacks: json.feedbacks})
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  aggregateResponses(fid) {
    if (this.state.feedbacks.length > 0) {
      var responses = []
      var feedbackResponses = this.state.feedbacks.map((feedback) => {
        return feedback.responses
      })
      feedbackResponses.forEach((feedbackResponse)=>{
        feedbackResponse.forEach((singleResponse)=>{
          if (singleResponse.fid === fid) {
            responses.push(singleResponse.data)
          }
        })
      })
      return (
        <div className="flex-column alter-color-rows">
          <span className="response-count">{responses.length} responses</span>
          {
            responses.map((response, index)=>{
              return (
                <div className="alter-color-row" key={index}>{response}</div>
              )
            })
          }
        </div>
      )
    }
  }

  reformatDatas(datas) {
    try{
      datas = JSON.parse(datas);
    }catch(e){
      return []
    }
    return Object.keys(datas).map(function (key) {
      let obj = {
        'name': key,
        'value': datas[key]
      }
      return obj
    });
  }

  renderSummary(template_index) {
    if (template_index !== null) {
      let fields = this.state.templates[template_index].fields
      return (
        <div className="flex-column">
          {
            fields.map((field, index)=>{
              return (
                <div key={field._id} className="flex-column feedback-preview-question-wrapper">
                  <div className="feedback-preview-question">
                    <div className="feedback-preview-question">
                      {field.question}
                    </div>
                  </div>
                  <div>
                    { field.type === 'response' && (
                      <div className="flex-column">
                        {this.aggregateResponses(field._id)}
                      </div>
                    )}
                    { (!!field.datas && (field.type === 'mc' || field.type === 'rate')) && (
                      <ResponsiveContainer minWidth={400} minHeight={400}>
                        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                          <Pie
                            data={this.reformatDatas(field.datas)}
                            cx={300}
                            cy={200}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            >
                            {
                              this.reformatDatas(field.datas).map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                            }
                          </Pie>
                          <Legend layout="vertical" align="right" verticalAlign="top" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }

  renderTemplate(template_index) {
    if (template_index !== null) {
      let template_id = this.state.templates[template_index]._id
      let title = this.state.templates[template_index].title
      let fields = this.state.templates[template_index].fields
      return (
        <div className="flex-column">
          <div className="flex-row justify-right" style={{marginLeft:16}}>
            <FlatButton
              label="Preview"
              labelStyle={{color: "#fff"}}
              rippleColor="#B2DFDB"
              backgroundColor="#00BFA5"
              hoverColor="#26A69A"
              onClick={()=>{
                this.props.dispatch(push('/feedback/' + template_id))
              }}
              />
          </div>
          <div className="feedback-preview-title">{title}</div>
          {
            fields.map((field, index)=>{
              return (
                <div key={field._id} className="flex-column feedback-preview-question-wrapper">
                  <div className="feedback-preview-question">
                    {field.question}
                  </div>
                  <div>
                    { field.type === "response" && (
                      <TextField
                        hintText="Response"
                        multiLine={true}
                        rows={2}
                        fullWidth={true}
                        disabled={true}
                        />
                    ) }
                    { field.type === "mc" && (
                      <RadioButtonGroup name={`choice${index}`}>
                        {
                          field.choices.map((choice, choice_index)=>{
                            return (
                              <RadioButton
                                value={choice}
                                label={choice}
                                key={choice_index}
                                style={{margin: "8px 0"}}
                                disabled={true}
                                />
                            )
                          })
                        }
                      </RadioButtonGroup>
                    ) }
                    { field.type === "rate" && (
                      <div className="flex-row feedback-rates-preview">
                        {
                          field.rates.map((rate, rate_index)=>{
                            return (
                              <div className="flex-column align-center flex-auto-with" key={rate}>
                                <div>{rate}</div>
                                <input name={`rate${index}`} type="radio" value={rate} disabled="true"/>
                              </div>
                            )
                          })
                        }
                      </div>
                    ) }
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }

  render() {
    return (
      <div className="view-body flex-row" style={{minHeight: '100%'}}>
        <div className="feedback-form-list flex-column" style={{width: 400, position: 'fixed'}}>
          <div className="flex-column default-padding">
            <FlatButton
              label="Create new survey"
              backgroundColor="rgb(48, 73, 102)"
              hoverColor="rgba(48, 73, 102, 0.8)"
              style={{color: '#fff'}}
              onTouchTap={()=>{
                this.showCreateForm()
              }}
              />
          </div>

          { this.state.templates.map((template, index)=>{
            return (
              <ListItem
                key={template._id}
                primaryText={template.title}
                secondaryText={`${template.fields.length} question`}
                onTouchTap={()=>{
                  this.showTemplate(index)
                }}
                rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                />
            )
          }) }
        </div>
        <div className="feedback-form-list flex-column" style={{backgroundColor: "#f7f7f7", flex: 100, paddingLeft: 400}}>

          { this.state.createForm ? (
            <div className="feedback-form-editor light-card">
              <NewFeedbackForm onSubmit={this.handleFeecbackTemplateFormSubmit}></NewFeedbackForm>
            </div>
          ) : (
            <Tabs
              value={this.state.rightPanelTab}
              onChange={this.handleRightPanelTabChange}
              style={{margin: "16px"}}
              className="light-card"
              >
              <Tab label="QUESTIONS" value="questions" style={{backgroundColor: "#fff", color: "#333", borderBottom: "1px solid #ddd"}}>

                <div className="feedback-form-preview" style={{padding: 16, margin: 0}}>
                  {this.renderTemplate(this.state.templateIndex)}
                </div>
              </Tab>
              <Tab label="RESPONSES" value="responses" style={{backgroundColor: "#fff", color: "#333", borderBottom: "1px solid #ddd"}}>
                <div className="feedback-form-preview" style={{padding: 16, margin: 0}}>
                  {this.renderSummary(this.state.templateIndex)}
                </div>
              </Tab>
            </Tabs>

          ) }
        </div>

      </div>
    );
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(ManageFeedbackView);
