import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
  render() {
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            {Object.keys(this.props.emotions).map(emotion =>
              <tr key={emotion}>
                <td>{emotion}</td>
                <td>{this.props.emotions[emotion]}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}
export default EmotionTable;
