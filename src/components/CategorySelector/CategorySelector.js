import React, { Component } from 'react';
import categoryTypes from '../../assets/categories';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';

const categoryMenuItems = []

categoryTypes.forEach((category) => {
  categoryMenuItems.push(<MenuItem value={category.code} label={category.name} key={category.code} primaryText={category.name}/>)
})

class CategorySelector extends Component {
  constructor(props) {
    super(props)
    const initialCategories = [];
    if (this.props.initialValues) {
      this.props.initialValues.forEach((code) => {
        initialCategories.push(categoryTypes[code - 1])
      })
    }
    this.state = {
      categories: initialCategories
    }
  }

  componentWillReceiveProps(nextProp) {
    const initialCategories = [];
    if (nextProp.initialValues) {
      nextProp.initialValues.forEach((code) => {
        initialCategories.push(categoryTypes[code - 1])
      })
    }
    this.setState({categories: initialCategories})
  }

  selectCategory = (event, index, value) => {
    this.chipData = this.state.categories;
    if (this.chipData.length !== 3) {
      const chipExist = this.chipData.map((chip) => chip.code).indexOf(index + 1);
      if (chipExist) {
        const newCategory = categoryTypes[index]
        const newCategories = this.state.categories.concat([newCategory])
        this.setState({
          categories: newCategories
        })
        if(this.props.onSelect) {
          this.props.onSelect(newCategories);
        }
      }
    }
  }

  handleCategoryChipDelete = (code) => {
    var newState = this.state
    const categoryIndexToDelete = this.state.categories.map((category) => category.code).indexOf(code);
    newState.categories.splice(categoryIndexToDelete, 1);
    const newCategories = newState.categories
    if(this.props.onSelect) {
      this.props.onSelect(newCategories);
    }
    this.setState({newState});
  }

  render() {
    return (
      <div>
        { this.state.categories !== undefined ? (
          <div>
            <div style={{fontSize: "12px", color: "rgba(0, 0, 0, 0.49)", margin: "16px 0 8px 0"}}>Selected categories</div>
            <div className="flex-row flex-wrap">
              {
                this.state.categories.map((category) => {
                  return(
                    <Chip
                      key={ category.code }
                      style={{margin: "0 8px 8px 0"}}
                      onRequestDelete={() => this.handleCategoryChipDelete(category.code)}>
                      { category.name }
                    </Chip>
                  )
                })
              }
            </div>
          </div>
        ) : null }
        { this.state.categories.length === 3 ? <span style={{fontSize: "12px", color: "rgb(68, 138, 255)"}}>Reached max number of categories</span> : (
          <SelectField
            onChange={this.selectCategory}
            floatingLabelText="Choose category (multiple)">
            {categoryMenuItems}
          </SelectField>
        )}
      </div>
    )
  }
}

export default CategorySelector
