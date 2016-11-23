import React, {Component} from 'react';
import './OssImage.css';
const OssDomain = "https://wealthie.oss-us-east-1.aliyuncs.com/"
class OssImage extends Component {

  state = {
    url: null
  };

  componentDidMount() {
    if (this.props.ossKey && this.props.width) {
      this.checkImage(this.props.ossKey, this.props.width)
    }
  }

  checkImage(ossKey, width) {
    var urlToFile
    if (ossKey && isNaN(ossKey)) {
      urlToFile = `${OssDomain}${ossKey}?x-oss-process=image/resize,w_${width},limit_0/format,jpg`
    } else {
      urlToFile = `${OssDomain}${ossKey}`
    }
    this.setState({url: urlToFile})
  }

  render() {
    const {width} = this.props
    const {url} = this.state
    return (
      <div className={this.props.wrapperClass}>
      {url && (<img className={this.props.className} src={url} style={{"width": width}} alt=""/>)}
      </div>
      );
  }
}

export default OssImage;
